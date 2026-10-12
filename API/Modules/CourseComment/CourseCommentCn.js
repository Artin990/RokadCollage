import mongoose from "mongoose";
import { catchAsync, HandleERROR } from "vanta-api";
import CourseComment from "./CourseCommentMd.js";
import VirtualCourse from "../VirtualCourse/VirtualCourseMd.js";
import Enrollment from "../Enrollment/EnrollmentMd.js";
import User from "../User/UserMd.js";
import { containsProfanity } from "../../Utils/profanityFilter.js";
import { objectIdRegex } from "../../Utils/validateRequest.js";

/**
 * Creates a new top-level comment or reply for a Virtual Course.
 * POST /api/virtual-courses/:courseId/comments
 * POST /api/course-comments
 */
export const createComment = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId || req.body.courseId;
  const { text, type = "qa", parentId = null } = req.body;
  const userId = req.userId;

  // 1. Handle Parent comment if this is a reply FIRST to resolve courseId automatically
  let parentComment = null;
  const effectiveParentId = parentId || (req.params.id && req.params.id !== courseId ? req.params.id : null);
  if (effectiveParentId) {
    if (!objectIdRegex.test(effectiveParentId)) {
      return next(new HandleERROR("شناسه دیدگاه والد نامعتبر است", 400));
    }
    parentComment = await CourseComment.findById(effectiveParentId);
    if (!parentComment) {
      return next(new HandleERROR("دیدگاه والد برای ثبت پاسخ یافت نشد", 404));
    }
  }

  // Determine effective courseId (can be inferred from parent comment)
  const effectiveCourseId = courseId || (parentComment ? parentComment.course.toString() : null);
  if (!effectiveCourseId) {
    return next(new HandleERROR("شناسه دوره الزامی است", 400));
  }
  if (!objectIdRegex.test(effectiveCourseId)) {
    return next(new HandleERROR("شناسه دوره نامعتبر است", 400));
  }

  // 2. Validate course existence
  const course = await VirtualCourse.findById(effectiveCourseId);
  if (!course) {
    return next(new HandleERROR("دوره مجازی مورد نظر یافت نشد", 404));
  }

  // 3. Validate profanity
  const { hasProfanity, matchedWords } = containsProfanity(text);
  if (hasProfanity) {
    return next(
      new HandleERROR(
        `متن ارسالی شامل کلمات نامناسب یا غیرمجاز است (${matchedWords.join("، ")})`,
        400
      )
    );
  }

  // 4. Check enrollment status
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: effectiveCourseId,
  });
  const isEnrolled = Boolean(enrollment);

  // 5. Enforce Business Rule: Only enrolled students can submit 'review' comments
  const isAdminUser = req.role === "admin" || req.role === "superAdmin";
  const effectiveType = parentComment ? parentComment.type : type;
  if (effectiveType === "review" && !parentComment && !isEnrolled && !isAdminUser) {
    return next(
      new HandleERROR(
        "ثبت دیدگاه و نظر برای دوره، تنها برای دانشجویانی که در این دوره ثبت‌نام کرده‌اند امکان‌پذیر است. شما می‌توانید سوالات خود را در بخش پرسش و پاسخ مطرح نمایید.",
        403
      )
    );
  }

  const isAdminReply = isAdminUser;

  // 6. Create comment
  const comment = await CourseComment.create({
    course: effectiveCourseId,
    user: userId,
    text: text.trim(),
    type: effectiveType,
    parentId: parentComment ? parentComment._id : null,
    isAdminReply,
    isEnrolledStudent: isEnrolled,
  });

  // 7. Increment parent replyCount
  if (parentComment) {
    await CourseComment.findByIdAndUpdate(parentComment._id, {
      $inc: { replyCount: 1 },
    });
  }

  const populated = await CourseComment.findById(comment._id)
    .populate("user", "fullName phoneNumber role")
    .populate("course", "title img type category");

  return res.status(201).json({
    success: true,
    message: parentComment
      ? "پاسخ شما با موفقیت ثبت شد"
      : "دیدگاه شما با موفقیت ثبت شد",
    data: populated,
  });
});

/**
 * Get all root comments for a virtual course with pagination and filter.
 * GET /api/virtual-courses/:courseId/comments
 */
export const getCourseComments = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId || req.query.courseId;
  const {
    type, // 'review' | 'qa' | 'all'
    page = 1,
    limit = 25,
    sort = "newest", // 'newest' | 'popular' | 'oldest' | 'pinned'
    search,
    q,
  } = req.query;

  if (!courseId) {
    return next(new HandleERROR("شناسه دوره الزامی است", 400));
  }
  if (!objectIdRegex.test(courseId)) {
    return next(new HandleERROR("شناسه دوره نامعتبر است", 400));
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
  const skip = (pageNum - 1) * limitNum;

  // Filter root comments only (parentId: null)
  const queryFilter = {
    course: courseId,
    parentId: null,
  };

  if (type && (type === "review" || type === "qa")) {
    queryFilter.type = type;
  }

  const searchTerm = (search || q || "").trim();
  if (searchTerm) {
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    // Search users matching fullName or phoneNumber
    const matchingUsers = await User.find({
      $or: [{ fullName: regex }, { phoneNumber: regex }],
    }).select("_id");
    const matchingUserIds = matchingUsers.map((u) => u._id);

    queryFilter.$or = [
      { text: regex },
      { user: { $in: matchingUserIds } },
    ];
  }

  // Sorting
  let sortCriteria = { isPinned: -1, createdAt: -1 };
  if (sort === "oldest") {
    sortCriteria = { isPinned: -1, createdAt: 1 };
  } else if (sort === "popular") {
    sortCriteria = { isPinned: -1, replyCount: -1, createdAt: -1 };
  }

  const [totalCount, totalReviews, totalQa, totalHearted, comments] = await Promise.all([
    CourseComment.countDocuments(queryFilter),
    CourseComment.countDocuments({ course: courseId, parentId: null, type: "review" }),
    CourseComment.countDocuments({ course: courseId, parentId: null, type: "qa" }),
    CourseComment.countDocuments({ course: courseId, parentId: null, isHeartedByAdmin: true }),
    CourseComment.find(queryFilter)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNum)
      .populate("user", "fullName phoneNumber role")
      .lean(),
  ]);

  const currentUserId = req.userId ? req.userId.toString() : null;

  let enrichedComments = comments.map((c) => {
    const likesArr = Array.isArray(c.likes) ? c.likes : [];
    const dislikesArr = Array.isArray(c.dislikes) ? c.dislikes : [];

    return {
      ...c,
      likesCount: likesArr.length,
      dislikesCount: dislikesArr.length,
      hasLiked: currentUserId
        ? likesArr.some((id) => id?.toString() === currentUserId)
        : false,
      hasDisliked: currentUserId
        ? dislikesArr.some((id) => id?.toString() === currentUserId)
        : false,
      likes: undefined, // Hide raw IDs array from output
      dislikes: undefined,
    };
  });

  if (sort === "popular") {
    enrichedComments.sort(
      (a, b) =>
        (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) ||
        (b.likesCount - a.likesCount) ||
        (b.replyCount - a.replyCount) ||
        (new Date(b.createdAt) - new Date(a.createdAt))
    );
  }

  return res.status(200).json({
    success: true,
    data: enrichedComments,
    pagination: {
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalCount / limitNum),
    },
    meta: {
      totalReviews,
      totalQa,
      totalAll: totalReviews + totalQa,
      totalHearted,
    },
  });
});

/**
 * Get nested replies for a specific parent comment.
 * GET /api/course-comments/:commentId/replies
 * GET /api/virtual-courses/:courseId/comments/:commentId/replies
 */
export const getCommentReplies = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId || req.params.id;

  const replies = await CourseComment.find({ parentId: commentId })
    .sort({ createdAt: 1 })
    .populate("user", "fullName phoneNumber role")
    .lean();

  const currentUserId = req.userId ? req.userId.toString() : null;

  const enrichedReplies = replies.map((r) => {
    const likesArr = Array.isArray(r.likes) ? r.likes : [];
    const dislikesArr = Array.isArray(r.dislikes) ? r.dislikes : [];

    return {
      ...r,
      likesCount: likesArr.length,
      dislikesCount: dislikesArr.length,
      hasLiked: currentUserId
        ? likesArr.some((id) => id?.toString() === currentUserId)
        : false,
      hasDisliked: currentUserId
        ? dislikesArr.some((id) => id?.toString() === currentUserId)
        : false,
      likes: undefined,
      dislikes: undefined,
    };
  });

  return res.status(200).json({
    success: true,
    count: enrichedReplies.length,
    data: enrichedReplies,
  });
});

/**
 * Toggle Like on a comment.
 * POST /api/course-comments/:id/like
 */
export const toggleLikeComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  const comment = await CourseComment.findById(id);
  if (!comment) {
    return next(new HandleERROR("دیدگاه مورد نظر یافت نشد", 404));
  }

  const hasLiked = comment.likes.some((uid) => uid.toString() === userId.toString());

  let updated;
  if (hasLiked) {
    // Remove like
    updated = await CourseComment.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
  } else {
    // Add like and remove dislike
    updated = await CourseComment.findByIdAndUpdate(
      id,
      {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId },
      },
      { new: true }
    );
  }

  const updatedHasLiked = updated.likes.some((uid) => uid.toString() === userId.toString());
  const updatedHasDisliked = updated.dislikes.some((uid) => uid.toString() === userId.toString());

  return res.status(200).json({
    success: true,
    data: {
      commentId: id,
      likesCount: updated.likes.length,
      dislikesCount: updated.dislikes.length,
      hasLiked: updatedHasLiked,
      hasDisliked: updatedHasDisliked,
    },
  });
});

/**
 * Toggle Dislike on a comment.
 * POST /api/course-comments/:id/dislike
 */
export const toggleDislikeComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  const comment = await CourseComment.findById(id);
  if (!comment) {
    return next(new HandleERROR("دیدگاه مورد نظر یافت نشد", 404));
  }

  const hasDisliked = comment.dislikes.some((uid) => uid.toString() === userId.toString());

  let updated;
  if (hasDisliked) {
    // Remove dislike
    updated = await CourseComment.findByIdAndUpdate(
      id,
      { $pull: { dislikes: userId } },
      { new: true }
    );
  } else {
    // Add dislike and remove like
    updated = await CourseComment.findByIdAndUpdate(
      id,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId },
      },
      { new: true }
    );
  }

  const updatedHasLiked = updated.likes.some((uid) => uid.toString() === userId.toString());
  const updatedHasDisliked = updated.dislikes.some((uid) => uid.toString() === userId.toString());

  return res.status(200).json({
    success: true,
    data: {
      commentId: id,
      likesCount: updated.likes.length,
      dislikesCount: updated.dislikes.length,
      hasLiked: updatedHasLiked,
      hasDisliked: updatedHasDisliked,
    },
  });
});

/**
 * Toggle Heart by Academy / Admin (like YouTube channel heart).
 * PATCH /api/course-comments/:id/heart
 */
export const toggleAdminHeart = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await CourseComment.findById(id);
  if (!comment) {
    return next(new HandleERROR("دیدگاه مورد نظر یافت نشد", 404));
  }

  comment.isHeartedByAdmin = !comment.isHeartedByAdmin;
  await comment.save();

  return res.status(200).json({
    success: true,
    message: comment.isHeartedByAdmin
      ? "قلب از طرف آموزشگاه برای این دیدگاه ثبت شد"
      : "قلب آموزشگاه از روی این دیدگاه برداشته شد",
    data: {
      commentId: id,
      isHeartedByAdmin: comment.isHeartedByAdmin,
    },
  });
});

/**
 * Toggle Pin comment (Admin only).
 * PATCH /api/course-comments/:id/pin
 */
export const togglePinComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await CourseComment.findById(id);
  if (!comment) {
    return next(new HandleERROR("دیدگاه مورد نظر یافت نشد", 404));
  }

  comment.isPinned = !comment.isPinned;
  await comment.save();

  return res.status(200).json({
    success: true,
    message: comment.isPinned
      ? "دیدگاه با موفقیت پین شد"
      : "دیدگاه از حالت پین خارج شد",
    data: {
      commentId: id,
      isPinned: comment.isPinned,
    },
  });
});

/**
 * Delete a comment (Admin or Author).
 * Automatically cleans up all nested replies.
 * DELETE /api/course-comments/:id
 */
export const deleteComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await CourseComment.findById(id);
  if (!comment) {
    return next(new HandleERROR("دیدگاه مورد نظر یافت نشد", 404));
  }

  const isOwner = comment.user.toString() === req.userId.toString();
  const isAdmin = req.role === "admin" || req.role === "superAdmin";
  if (!isOwner && !isAdmin) {
    return next(new HandleERROR("شما دسترسی لازم برای حذف این دیدگاه را ندارید", 403));
  }

  // If this was a reply, safely decrement parent's replyCount (guarding against negative)
  if (comment.parentId) {
    await CourseComment.findOneAndUpdate(
      { _id: comment.parentId, replyCount: { $gt: 0 } },
      { $inc: { replyCount: -1 } }
    );
  }

  // Cascade delete all child replies
  await CourseComment.deleteMany({ parentId: comment._id });

  // Delete the comment itself
  await CourseComment.findByIdAndDelete(comment._id);

  return res.status(200).json({
    success: true,
    message: "دیدگاه با موفقیت حذف شد",
    data: {
      commentId: id,
    },
  });
});

/**
 * Get comments for Admin Dashboard (can filter across all courses or by course).
 * GET /api/course-comments/admin/all
 */
export const getAdminComments = catchAsync(async (req, res, next) => {
  const {
    courseId,
    type,
    search,
    isHeartedByAdmin,
    isPinned,
    isAdminReply,
    page = 1,
    limit = 20,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const queryFilter = {};

  if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
    queryFilter.course = new mongoose.Types.ObjectId(courseId);
  }

  if (type && (type === "review" || type === "qa")) {
    queryFilter.type = type;
  }

  if (isHeartedByAdmin !== undefined && isHeartedByAdmin !== "") {
    queryFilter.isHeartedByAdmin = isHeartedByAdmin === "true";
  }

  if (isPinned !== undefined && isPinned !== "") {
    queryFilter.isPinned = isPinned === "true";
  }

  if (isAdminReply !== undefined && isAdminReply !== "") {
    queryFilter.isAdminReply = isAdminReply === "true";
  }

  const searchTerm = (search || req.query.q || "").trim();
  if (searchTerm) {
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const matchingUsers = await User.find({
      $or: [{ fullName: regex }, { phoneNumber: regex }],
    }).select("_id");
    const matchingUserIds = matchingUsers.map((u) => u._id);

    queryFilter.$or = [
      { text: regex },
      { user: { $in: matchingUserIds } },
    ];
  }

  const [total, comments] = await Promise.all([
    CourseComment.countDocuments(queryFilter),
    CourseComment.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("user", "fullName phoneNumber role")
      .populate("course", "title img type category")
      .lean(),
  ]);

  const enriched = comments.map((c) => ({
    ...c,
    likesCount: Array.isArray(c.likes) ? c.likes.length : 0,
    dislikesCount: Array.isArray(c.dislikes) ? c.dislikes.length : 0,
    likes: undefined,
    dislikes: undefined,
  }));

  return res.status(200).json({
    success: true,
    data: enriched,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});
