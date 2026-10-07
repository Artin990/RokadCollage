import { Router } from "express";
import {
    getSessionsByCourse,
    createSession,
    updateSession,
    deleteSession,
} from "./CourseSessionCn.js";
import IsLogin from "../../../Middleware/IsLogin.js";
import IsAdmin from "../../../Middleware/IsAdmin.js";
import {
    validateRequest,
    validateParams,
    createObjectIdParamsValidator,
} from "../../../Utils/validateRequest.js";
import {
    createSessionValidator,
    updateSessionValidator,
} from "./CourseSessionValidation.js";
import { adminManualEnroll } from "../../Enrollment/EnrollmentCn.js";
import { adminManualEnrollValidator } from "../../Enrollment/EnrollmentValidation.js";

const courseSessionRouter = Router({ mergeParams: true });

const sessionIdValidator = createObjectIdParamsValidator("sessionId");

courseSessionRouter
    .route("/")
    .get(getSessionsByCourse)
    .post(IsLogin, IsAdmin, validateRequest(createSessionValidator), createSession);

courseSessionRouter
    .route("/:sessionId/enrollments")
    .post(
        IsLogin,
        IsAdmin,
        validateParams(sessionIdValidator),
        validateRequest(adminManualEnrollValidator),
        adminManualEnroll
    );

courseSessionRouter
    .route("/:sessionId")
    .patch(
        IsLogin,
        IsAdmin,
        validateParams(sessionIdValidator),
        validateRequest(updateSessionValidator),
        updateSession
    )
    .delete(IsLogin, IsAdmin, validateParams(sessionIdValidator), deleteSession);

export default courseSessionRouter;

/**
 * @swagger
 * tags:
 *   - name: CourseSession
 *     description: مدیریت جلسات و کدهای کلاسی دوره‌های حضوری
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseSession:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         course:
 *           type: string
 *           description: شناسه دوره حضوری والد
 *         code:
 *           type: string
 *           example: "کد ۰۱"
 *         scheduleDays:
 *           type: string
 *           example: "شنبه و چهارشنبه"
 *         scheduleHours:
 *           type: string
 *           example: "۱۶:۰۰ الی ۱۸:۰۰"
 *         capacity:
 *           type: integer
 *           example: 15
 *         enrolledCount:
 *           type: integer
 *           example: 4
 *         remainingCapacity:
 *           type: integer
 *           example: 11
 *           description: ظرفیت باقیمانده (محاسبه‌شده)
 *         isFull:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateSessionPayload:
 *       type: object
 *       required:
 *         - code
 *         - scheduleDays
 *         - scheduleHours
 *         - capacity
 *       properties:
 *         code:
 *           type: string
 *           example: "کد ۰۲"
 *         scheduleDays:
 *           type: string
 *           example: "یک‌شنبه و سه‌شنبه"
 *         scheduleHours:
 *           type: string
 *           example: "۱۸:۰۰ الی ۲۰:۰۰"
 *         capacity:
 *           type: integer
 *           example: 12
 *     UpdateSessionPayload:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "کد ۰۲ (تکمیل)"
 *         scheduleDays:
 *           type: string
 *           example: "یک‌شنبه و سه‌شنبه"
 *         scheduleHours:
 *           type: string
 *           example: "۱۸:۰۰ الی ۲۰:۰۰"
 *         capacity:
 *           type: integer
 *           example: 14
 *     AdminManualEnrollSessionInput:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: شناسه کاربر جهت ثبت‌نام مستقیم
 */

/**
 * @swagger
 * /api/in-person-courses/{courseId}/sessions:
 *   get:
 *     summary: دریافت لیست جلسات و کدهای کلاسی یک دوره حضوری
 *     description: بازگرداندن تمام کدهای کلاسی ثبت‌شده به همراه فیلدهای محاسبه‌شده remainingCapacity و isFull
 *     tags: [CourseSession]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دوره حضوری
 *     responses:
 *       200:
 *         description: لیست جلسات با موفقیت دریافت شد
 *       404:
 *         description: دوره حضوری مورد نظر یافت نشد
 *
 *   post:
 *     summary: افزودن کد کلاس جدید به دوره حضوری (مدیر سیستم)
 *     tags: [CourseSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionPayload'
 *     responses:
 *       201:
 *         description: کد کلاس جدید با موفقیت ایجاد شد
 *       400:
 *         description: کد کلاس تکراری یا خطای اعتبارسنجی
 *       404:
 *         description: دوره حضوری یافت نشد
 *
 * /api/in-person-courses/{courseId}/sessions/{sessionId}:
 *   patch:
 *     summary: ویرایش اطلاعات و زمان‌بندی کد کلاس (مدیر سیستم)
 *     tags: [CourseSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSessionPayload'
 *     responses:
 *       200:
 *         description: کد کلاس با موفقیت بروزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       404:
 *         description: کد کلاس یافت نشد
 *
 *   delete:
 *     summary: حذف کد کلاس (مدیر سیستم)
 *     description: حذف جلسه در صورتی امکان‌پذیر است که هیچ دانشجویی در آن ثبت‌نام نکرده باشد
 *     tags: [CourseSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: کد کلاس با موفقیت حذف شد
 *       400:
 *         description: به دلیل وجود ثبت‌نام فعال، حذف این کد کلاس امکان‌پذیر نیست
 *       404:
 *         description: کد کلاس یافت نشد
 *
 * /api/in-person-courses/{courseId}/sessions/{sessionId}/enrollments:
 *   post:
 *     summary: ثبت‌نام مستقیم دستی دانشجو در جلسه حضوری توسط مدیر
 *     description: ثبت‌نام دانشجو بدون نیاز به کسر موجودی کیف پول و ایجاد رکورد ثبت‌نام
 *     tags: [CourseSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminManualEnrollSessionInput'
 *     responses:
 *       201:
 *         description: کاربر با موفقیت در کد کلاس ثبت‌نام شد
 *       400:
 *         description: ظرفیت تکمیل است یا کاربر قبلاً ثبت‌نام کرده است
 *       404:
 *         description: کاربر، دوره یا کد کلاس یافت نشد
 */

