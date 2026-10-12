import { Router } from "express";
import {
  createComment,
  getCourseComments,
  getCommentReplies,
  toggleLikeComment,
  toggleDislikeComment,
  toggleAdminHeart,
  togglePinComment,
  deleteComment,
  getAdminComments,
} from "./CourseCommentCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import {
  validateRequest,
  validateParams,
  objectIdParamValidator,
  createObjectIdParamsValidator,
} from "../../Utils/validateRequest.js";
import {
  createCommentValidator,
  replyCommentValidator,
} from "./CourseCommentValidation.js";

const courseCommentRouter = Router({ mergeParams: true });

// Course Param Validator for nested route: /virtual-courses/:courseId/comments
const courseIdParamValidator = createObjectIdParamsValidator("courseId");

// Root / Collection Endpoints
courseCommentRouter.route("/")
  .get(getCourseComments)
  .post(IsLogin, validateRequest(createCommentValidator), createComment);

// Admin-wide listing
courseCommentRouter.get("/admin/all", IsLogin, IsAdmin, getAdminComments);

// Single Comment Operations
courseCommentRouter.route("/:id")
  .delete(IsLogin, validateParams(objectIdParamValidator), deleteComment);

// Nested Replies
courseCommentRouter.route("/:id/replies")
  .get(validateParams(objectIdParamValidator), getCommentReplies);

// Reply to specific comment
courseCommentRouter.post(
  "/:id/reply",
  IsLogin,
  validateParams(objectIdParamValidator),
  validateRequest(replyCommentValidator),
  (req, res, next) => {
    req.body.parentId = req.params.id;
    return createComment(req, res, next);
  }
);

// Interactions: Like / Dislike
courseCommentRouter.post(
  "/:id/like",
  IsLogin,
  validateParams(objectIdParamValidator),
  toggleLikeComment
);

courseCommentRouter.post(
  "/:id/dislike",
  IsLogin,
  validateParams(objectIdParamValidator),
  toggleDislikeComment
);

// Admin YouTube-style Heart toggle
courseCommentRouter.patch(
  "/:id/heart",
  IsLogin,
  IsAdmin,
  validateParams(objectIdParamValidator),
  toggleAdminHeart
);

// Admin Pin toggle
courseCommentRouter.patch(
  "/:id/pin",
  IsLogin,
  IsAdmin,
  validateParams(objectIdParamValidator),
  togglePinComment
);

export default courseCommentRouter;

/**
 * @swagger
 * tags:
 *   - name: CourseComment
 *     description: دیدگاه‌ها، نظرات و پرسش‌وپاسخ دانشجویان در دوره‌های مجازی (با لایک، دیس‌لایک، پاسخ و قلب آموزشگاه)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseComment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         course:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             role:
 *               type: string
 *         text:
 *           type: string
 *         type:
 *           type: string
 *           enum: [review, qa]
 *         parentId:
 *           type: string
 *           nullable: true
 *         likesCount:
 *           type: integer
 *         dislikesCount:
 *           type: integer
 *         hasLiked:
 *           type: boolean
 *         hasDisliked:
 *           type: boolean
 *         isHeartedByAdmin:
 *           type: boolean
 *         isPinned:
 *           type: boolean
 *         isAdminReply:
 *           type: boolean
 *         isEnrolledStudent:
 *           type: boolean
 *         replyCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCourseCommentInput:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           example: "این دوره فوق‌العاده کاربردی بود، پیشنهاد می‌کنم حتماً سرفصل‌ها را دقیق مشاهده کنید."
 *         type:
 *           type: string
 *           enum: [review, qa]
 *           default: qa
 *           example: "review"
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 *
 *     ReplyCourseCommentInput:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           example: "درود بر شما، ممنون از بازخورد ارزشمندتان!"
 */

/**
 * @swagger
 * /api/virtual-courses/{courseId}/comments:
 *   get:
 *     summary: دریافت لیست دیدگاه‌ها و پرسش‌وپاسخ‌های یک دوره مجازی
 *     description: دریافت دیدگاه‌های ریشه (بدون والد) یک دوره مجازی با وضعیت لایک/دیس‌لایک کاربر و پین‌ها در صدر
 *     tags: [CourseComment]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دوره مجازی
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [review, qa]
 *         description: فیلتر بر اساس نوع نظر (نقد و بررسی یا پرسش و پاسخ)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: فهرست دیدگاه‌های دوره با موفقیت بازگردانده شد
 *
 *   post:
 *     summary: ارسال دیدگاه یا پرسش جدید برای دوره مجازی
 *     description: ثبت نظر جدید برای دوره مجازی توسط کاربر احراز هویت شده (پشتیبانی از فیلتر پالایش کلمات نامناسب)
 *     tags: [CourseComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دوره مجازی
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseCommentInput'
 *     responses:
 *       201:
 *         description: دیدگاه با موفقیت ثبت شد
 *       400:
 *         description: متن دیدگاه خالی است یا حاوی کلمات غیرمجاز است
 *       401:
 *         description: عدم احراز هویت
 *
 * /api/course-comments/admin/all:
 *   get:
 *     summary: دریافت کلیه دیدگاه‌های دوره‌ها برای پنل مدیریت (مدیر سیستم)
 *     description: فهرست کامل تمام دیدگاه‌های دوره‌ها با قابلیت جستجو، فیلتر دوره و مدیریت
 *     tags: [CourseComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: فیلتر بر اساس دوره مشخص
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [review, qa]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: لیست دیدگاه‌ها برای مدیریت دریافت شد
 *       403:
 *         description: عدم دسترسی مدیر
 *
 * /api/course-comments/{id}/replies:
 *   get:
 *     summary: دریافت پاسخ‌های یک دیدگاه
 *     description: دریافت لیست زنجیره‌ای پاسخ‌های ثبت‌شده به یک نظر یا پرسش
 *     tags: [CourseComment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دیدگاه والد
 *     responses:
 *       200:
 *         description: لیست پاسخ‌ها با موفقیت دریافت شد
 *       404:
 *         description: دیدگاه والد یافت نشد
 *
 * /api/course-comments/{id}/reply:
 *   post:
 *     summary: ثبت پاسخ به یک دیدگاه مشخص
 *     description: ارسال پاسخ جدید به یک دیدگاه یا پرسش
 *     tags: [CourseComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دیدگاه والد
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReplyCourseCommentInput'
 *     responses:
 *       201:
 *         description: پاسخ با موفقیت ثبت شد
 *       400:
 *         description: متن پاسخ نامعتبر است
 *
 * /api/course-comments/{id}/like:
 *   post:
 *     summary: پسندیدن / لایک دیدگاه (یا لغو آن)
 *     description: ثبت واکنش پسند برای یک دیدگاه (در صورت کلیک مجدد لغو می‌شود)
 *     tags: [CourseComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دیدگاه
 *     responses:
 *       200:
 *         description: واکنش با موفقیت ثبت یا تغییر یافت
 *
 * /api/course-comments/{id}/dislike:
 *   post:
 *     summary: نپسندیدن / دیس‌لایک دیدگاه (یا لغو آن)
 *     description: ثبت واکنش نپسند برای یک دیدگاه
 *     tags: [CourseComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دیدگاه
 *     responses:
 *       200:
 *         description: واکنش با موفقیت ثبت یا تغییر یافت
 *
 * /api/course-comments/{id}/pin:
 *   patch:
 *     summary: سنجاق / پین کردن دیدگاه به بالای صفحه (مدیر سیستم)
 *     description: پین یا خروج از حالت پین برای دیدگاه‌های مهم در صفحه دوره
 *     tags: [CourseComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دیدگاه
 *     responses:
 *       200:
 *         description: وضعیت پین با موفقیت تغییر کرد
 *
 * /api/course-comments/{id}/heart:
 *   patch:
 *     summary: اهدای قلب آموزشگاه به دیدگاه (مدیر سیستم)
 *     description: نمایش نشان قلب آموزشگاه جهت تشویق و تایید پاسخ‌های ارزشمند کاربران
 *     tags: [CourseComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دیدگاه
 *     responses:
 *       200:
 *         description: وضعیت قلب با موفقیت تغییر کرد
 *
 * /api/course-comments/{id}:
 *   delete:
 *     summary: حذف دیدگاه (نویسنده دیدگاه یا مدیر سیستم)
 *     description: حذف نظر به همراه کلیه پاسخ‌های زیرمجموعه آن
 *     tags: [CourseComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دیدگاه
 *     responses:
 *       200:
 *         description: دیدگاه با موفقیت حذف شد
 *       403:
 *         description: شما دسترسی حذف این نظر را ندارید
 *       404:
 *         description: دیدگاه یافت نشد
 */
