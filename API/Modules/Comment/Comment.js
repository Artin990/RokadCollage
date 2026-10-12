import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./CommentCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest, validateParams, objectIdParamValidator } from "../../Utils/validateRequest.js";
import { createCommentValidator, updateCommentValidator } from "./CommentValidation.js";

const commentRouter = Router();

commentRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createCommentValidator), create);

commentRouter.route("/:id")
  .get(validateParams(objectIdParamValidator), getOne)
  .patch(IsLogin, IsAdmin, validateParams(objectIdParamValidator), validateRequest(updateCommentValidator), update)
  .put(IsLogin, IsAdmin, validateParams(objectIdParamValidator), validateRequest(updateCommentValidator), update)
  .delete(IsLogin, IsAdmin, validateParams(objectIdParamValidator), remove);

export default commentRouter;

/**
 * @swagger
 * tags:
 *   - name: Comment
 *     description: مدیریت نظرات و رضایت دانشجویان از دوره‌ها
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentCourseRef:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           example: "دوره جامع طراحی رابط کاربری"
 *         category:
 *           type: string
 *           example: "گرافیک"
 *         type:
 *           type: string
 *           example: "حضوری"
 *     Comment:
 *       type: object
 *       required:
 *         - course
 *         - comment
 *         - name
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *         course:
 *           anyOf:
 *             - type: string
 *               description: شناسه دوره
 *             - $ref: '#/components/schemas/CommentCourseRef'
 *         courseModel:
 *           type: string
 *           enum: [InPersonCourse, VirtualCourse]
 *           default: "InPersonCourse"
 *         comment:
 *           type: string
 *           example: "بهترین دوره UI/UX که تا به حال شرکت کرده بودم، سرفصل‌ها بسیار کاربردی بود."
 *         name:
 *           type: string
 *           example: "سارا حسینی"
 *         role:
 *           type: string
 *           example: "دانشجوی دوره پاییز"
 *         job:
 *           type: string
 *           example: "طراح محصول در دیجی‌کالا"
 *         img:
 *           type: string
 *           example: "student_avatar_456.webp"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateCommentInput:
 *       type: object
 *       required:
 *         - course
 *         - comment
 *         - name
 *         - role
 *       properties:
 *         course:
 *           type: string
 *           description: شناسه دوره مرتبط (حضوری یا مجازی)
 *         courseModel:
 *           type: string
 *           enum: [InPersonCourse, VirtualCourse]
 *           description: در صورت عدم ارسال، به صورت خودکار تشخیص داده می‌شود
 *         comment:
 *           type: string
 *           example: "بسیار دوره مفید و پرکاربردی بود."
 *         name:
 *           type: string
 *           example: "سارا حسینی"
 *         role:
 *           type: string
 *           example: "دانشجو"
 *         job:
 *           type: string
 *           example: "طراح UI"
 *         img:
 *           type: string
 *           example: "avatar.webp"
 *     UpdateCommentInput:
 *       type: object
 *       properties:
 *         course:
 *           type: string
 *         courseModel:
 *           type: string
 *           enum: [InPersonCourse, VirtualCourse]
 *         comment:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *         job:
 *           type: string
 *         img:
 *           type: string
 */

/**
 * @swagger
 * /api/comment:
 *   get:
 *     summary: دریافت فهرست نظرات دانشجویان
 *     description: |
 *       دریافت لیست نظرات.
 *       **نکته پیوند و متغیر مجازی:** به دلیل ماهیت چندریختی ارجاع به دوره‌ها (`course` متصل به InPersonCourse یا VirtualCourse) و عدم پشتیبانی متغیرهای مجازی در ApiFeatures، پر کردن مشخصات دوره (`title, category, type`) به صورت دستی در کنترلر سرور انجام شده و بازگردانده می‌شود.
 *     tags: [Comment]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: لیست نظرات با موفقیت دریافت شد
 *
 *   post:
 *     summary: ثبت نظر جدید (مدیر سیستم)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentInput'
 *     responses:
 *       201:
 *         description: نظر با موفقیت ایجاد شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 *
 * /api/comment/{id}:
 *   get:
 *     summary: دریافت یک نظر با شناسه
 *     description: دریافت جزئیات نظر به همراه دوره پیوندشده
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه نظر
 *     responses:
 *       200:
 *         description: نظر با موفقیت دریافت شد
 *       404:
 *         description: نظر مورد نظر یافت نشد
 *
 *   patch:
 *     summary: ویرایش نظر (مدیر سیستم)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentInput'
 *     responses:
 *       200:
 *         description: نظر با موفقیت بروزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       404:
 *         description: نظر مورد نظر یافت نشد
 *
 *   delete:
 *     summary: حذف نظر (مدیر سیستم)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: نظر با موفقیت حذف شد
 *       404:
 *         description: نظر مورد نظر یافت نشد
 */

