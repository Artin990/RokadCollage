import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Comment from "./CommentMd.js";
import InPersonCourse from "../InPersonCourse/InPersonCourseMd.js";
import VirtualCourse from "../VirtualCourse/VirtualCourseMd.js";
import { removePublicFile } from "../../Utils/fileHelper.js";

/**
 * Resolves the courseModel if not provided in the request body.
 */
async function resolveCourseModel(courseId, specifiedModel) {
  if (specifiedModel === "InPersonCourse" || specifiedModel === "VirtualCourse") {
    return specifiedModel;
  }
  const inPerson = await InPersonCourse.findById(courseId);
  if (inPerson) return "InPersonCourse";
  const virtual = await VirtualCourse.findById(courseId);
  if (virtual) return "VirtualCourse";
  return "InPersonCourse";
}

export const create = catchAsync(async (req, res, next) => {
  const { course, courseModel, comment, name, role, job, img } = req.body;

  const resolvedModel = await resolveCourseModel(course, courseModel);

  const newComment = await Comment.create({
    course,
    courseModel: resolvedModel,
    comment,
    name,
    role,
    job: job || "",
    img: img || "default-BoyStudent.png",
  });

  const populatedComment = await newComment.populate("course", "title category type");

  return res.status(201).json({
    success: true,
    message: "نظر با موفقیت ثبت شد",
    data: populatedComment,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .filter()
    .search(["name", "comment", "role", "job"])
    .sort()
    .limitFields()
    .paginate();

  const result = await features.execute();
  const docs = Array.isArray(result) ? result : result?.data ? result.data : [];

  for (const doc of docs) {
    if (!doc.courseModel && doc.course) {
      doc.courseModel = "InPersonCourse";
    }
  }

  await Comment.populate(docs, {
    path: "course",
    select: "title category type",
  });

  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .limitFields();

  const result = await features.execute();
  const doc = Array.isArray(result) ? result[0] : result?.data ? result.data[0] : result;

  if (!doc) {
    return next(new HandleERROR("نظر مورد نظر یافت نشد", 404));
  }

  if (!doc.courseModel && doc.course) {
    doc.courseModel = "InPersonCourse";
  }

  await Comment.populate(doc, {
    path: "course",
    select: "title category type",
  });

  return res.status(200).json({
    success: true,
    data: doc,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["course", "courseModel", "comment", "name", "role", "job", "img"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const oldComment = await Comment.findById(req.params.id);
  if (!oldComment) {
    return next(new HandleERROR("نظر مورد نظر یافت نشد", 404));
  }

  if (updates.course && !updates.courseModel) {
    updates.courseModel = await resolveCourseModel(updates.course);
  }

  if (updates.img && updates.img !== oldComment.img) {
    removePublicFile(oldComment.img);
  }

  const updatedComment = await Comment.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("course", "title category type");

  return res.status(200).json({
    success: true,
    message: "نظر با موفقیت بروزرسانی شد",
    data: updatedComment,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const deleteComment = await Comment.findByIdAndDelete(req.params.id);

  if (!deleteComment) {
    return next(new HandleERROR("نظر مورد نظر یافت نشد", 404));
  }

  if (deleteComment.img) {
    removePublicFile(deleteComment.img);
  }

  return res.status(200).json({
    success: true,
    message: "نظر با موفقیت حذف شد",
    data: null,
  });
});
