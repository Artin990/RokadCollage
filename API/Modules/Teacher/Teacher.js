import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./TeacherCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest, validateParams, objectIdParamValidator } from "../../Utils/validateRequest.js";
import { createTeacherValidator, updateTeacherValidator } from "./TeacherValidation.js";

const teacherRouter = Router();

teacherRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createTeacherValidator), create);

teacherRouter.route("/:id")
  .get(validateParams(objectIdParamValidator), getOne)
  .patch(IsLogin, IsAdmin, validateParams(objectIdParamValidator), validateRequest(updateTeacherValidator), update)
  .delete(IsLogin, IsAdmin, validateParams(objectIdParamValidator), remove);

export default teacherRouter;

/**
 * @swagger
 * tags:
 *   - name: Teacher
 *     description: مدیریت معلمان و اساتید کالج رکاد
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - specialization
 *         - photo
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: نام و نام خانوادگی معلم
 *           example: "مهندس شایان پرویزی"
 *         specialization:
 *           type: string
 *           description: حوزه کاری و تخصص معلم
 *           example: "توسعه‌دهنده فول‌استک و متخصص React"
 *         photo:
 *           type: string
 *           description: نام فایل تصویر آپلود شده
 *           example: "teacher_avatar_123.webp"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateTeacherInput:
 *       type: object
 *       required:
 *         - name
 *         - specialization
 *         - photo
 *       properties:
 *         name:
 *           type: string
 *           example: "مهندس شایان پرویزی"
 *         specialization:
 *           type: string
 *           example: "توسعه‌دهنده فول‌استک و متخصص React"
 *         photo:
 *           type: string
 *           example: "teacher_avatar_123.webp"
 *     UpdateTeacherInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "مهندس شایان پرویزی"
 *         specialization:
 *           type: string
 *           example: "توسعه‌دهنده فول‌استک و متخصص React"
 *         photo:
 *           type: string
 *           example: "teacher_avatar_123.webp"
 */

/**
 * @swagger
 * /api/teacher:
 *   get:
 *     summary: دریافت فهرست اساتید کالج رکاد
 *     description: دریافت لیست معلمان با قابلیت جستجوی متنی در نام و تخصص، صفحه‌بندی، مرتب‌سازی و پیوند مراجع (vanta-api populate).
 *     tags: [Teacher]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: جستجوی نام یا حوزه تخصص استاد
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: تعداد در هر صفحه
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: فیلد مرتب‌سازی
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: فیلدهای انتخابی
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: پیوند فیلدهای ارتباطی
 *     responses:
 *       200:
 *         description: لیست اساتید با موفقیت دریافت شد
 *
 *   post:
 *     summary: ثبت استاد جدید (مدیر سیستم)
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeacherInput'
 *     responses:
 *       201:
 *         description: استاد جدید با موفقیت ثبت شد
 *       400:
 *         description: خطای اعتبارسنجی ورودی
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 *
 * /api/teacher/{id}:
 *   get:
 *     summary: دریافت اطلاعات یک استاد با شناسه
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه ۲۴ کاراکتری استاد
 *     responses:
 *       200:
 *         description: مشخصات استاد با موفقیت دریافت شد
 *       404:
 *         description: معلم مورد نظر یافت نشد
 *
 *   patch:
 *     summary: ویرایش اطلاعات استاد (مدیر سیستم)
 *     tags: [Teacher]
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
 *             $ref: '#/components/schemas/UpdateTeacherInput'
 *     responses:
 *       200:
 *         description: اطلاعات استاد با موفقیت بروزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       403:
 *         description: عدم دسترسی
 *       404:
 *         description: استاد یافت نشد
 *
 *   delete:
 *     summary: حذف استاد (مدیر سیستم)
 *     tags: [Teacher]
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
 *         description: استاد با موفقیت حذف شد
 *       403:
 *         description: عدم دسترسی
 *       404:
 *         description: استاد یافت نشد
 */

