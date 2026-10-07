import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    remove,
    update,
    toggleDiscountCode,
    purchaseVirtualCourse,
    adminManualEnrollVirtual,
} from "./VirtualCourseCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import {
    validateRequest,
    validateParams,
    objectIdParamValidator,
    createObjectIdParamsValidator,
} from "../../Utils/validateRequest.js";
import {
    createVirtualCourseValidator,
    updateVirtualCourseValidator,
    purchaseVirtualCourseValidator,
} from "./VirtualCourseValidation.js";

const virtualCourseRouter = Router();

// Quick toggle active state of a course discount code
// PATCH /virtual-courses/:courseId/discount-codes/:codeId/toggle
virtualCourseRouter.patch(
    "/:courseId/discount-codes/:codeId/toggle",
    IsLogin,
    IsAdmin,
    validateParams(createObjectIdParamsValidator("courseId", "codeId")),
    toggleDiscountCode
);

// Admin manual enrollment in virtual course
// POST /virtual-courses/:id/enrollments
virtualCourseRouter.post(
    "/:id/enrollments",
    IsLogin,
    IsAdmin,
    validateParams(objectIdParamValidator),
    adminManualEnrollVirtual
);

// Purchase virtual course
// POST /virtual-courses/:id/purchase
virtualCourseRouter.post(
    "/:id/purchase",
    IsLogin,
    validateParams(objectIdParamValidator),
    validateRequest(purchaseVirtualCourseValidator),
    purchaseVirtualCourse
);

virtualCourseRouter
    .route("/")
    .get(getAll)
    .post(IsLogin, IsAdmin, validateRequest(createVirtualCourseValidator), create);

virtualCourseRouter
    .route("/:id")
    .get(validateParams(objectIdParamValidator), getOne)
    .patch(IsLogin, IsAdmin, validateParams(objectIdParamValidator), validateRequest(updateVirtualCourseValidator), update)
    .delete(IsLogin, IsAdmin, validateParams(objectIdParamValidator), remove);

export default virtualCourseRouter;

/**
 * @swagger
 * tags:
 *   - name: VirtualCourse
 *     description: مدیریت دوره‌های آنلاین و مجازی، اتصال به اسپات‌پلیر و خرید دوره‌های ویدیویی
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VirtualCourse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         category:
 *           type: string
 *           enum: [فناوری اطلاعات, گرافیک, زبان, MBA]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         title:
 *           type: string
 *           example: "دوره جامع برنامه‌نویسی ری‌اکت و Next.js"
 *         description:
 *           type: string
 *         duration:
 *           type: string
 *           example: "۴۰ ساعت ویدیو"
 *         icon:
 *           type: string
 *         price:
 *           type: number
 *           example: 3200000
 *         type:
 *           type: string
 *           example: "مجازی"
 *         spotplayerCourseId:
 *           type: string
 *           description: شناسه دوره ۲۴ کاراکتری در اسپات‌پلیر
 *           example: "64f9b8c0e4b0a1a2b3c4d5e6"
 *         timedDiscount:
 *           $ref: '#/components/schemas/CourseTimedDiscount'
 *         discountCodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseDiscountCode'
 *         teachers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Teacher'
 *         sprints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseSprint'
 *         finalPrice:
 *           type: number
 *           description: قیمت محاسبه‌شده با کسر تخفیف زمان‌دار
 *         isDiscountActive:
 *           type: boolean
 *         effectiveDiscountPercentage:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateVirtualCourseInput:
 *       type: object
 *       required:
 *         - category
 *         - title
 *         - description
 *         - duration
 *         - icon
 *         - spotplayerCourseId
 *       properties:
 *         category:
 *           type: string
 *           enum: [فناوری اطلاعات, گرافیک, زبان, MBA]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         duration:
 *           type: string
 *         icon:
 *           type: string
 *         price:
 *           type: number
 *           default: 0
 *         spotplayerCourseId:
 *           type: string
 *           description: شناسه دوره ۲۴ کاراکتری در اسپات‌پلیر
 *           example: "64f9b8c0e4b0a1a2b3c4d5e6"
 *         timedDiscount:
 *           $ref: '#/components/schemas/CourseTimedDiscount'
 *         discountCodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseDiscountCode'
 *         teachers:
 *           type: array
 *           items:
 *             type: string
 *             description: شناسه ObjectId مدرسین
 *         sprints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseSprint'
 *     UpdateVirtualCourseInput:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           enum: [فناوری اطلاعات, گرافیک, زبان, MBA]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         duration:
 *           type: string
 *         icon:
 *           type: string
 *         price:
 *           type: number
 *         spotplayerCourseId:
 *           type: string
 *           example: "64f9b8c0e4b0a1a2b3c4d5e6"
 *         timedDiscount:
 *           $ref: '#/components/schemas/CourseTimedDiscount'
 *         discountCodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseDiscountCode'
 *         teachers:
 *           type: array
 *           items:
 *             type: string
 *         sprints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseSprint'
 *     PurchaseVirtualCourseInput:
 *       type: object
 *       properties:
 *         couponCode:
 *           type: string
 *           description: کد تخفیف دلخواه (اختیاری)
 *     AdminManualEnrollVirtualInput:
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
 * /api/virtual-courses:
 *   get:
 *     summary: دریافت فهرست دوره‌های آنلاین و مجازی
 *     description: |
 *       دریافت لیست دوره‌های مجازی با امکان فیلتر و جستجو.
 *       **نکته پیوند و متغیرهای مجازی:** مدرسین (`teachers`) به همراه قیمت‌گذاری با تخفیف فعال به‌صورت خودکار توسط کنترلر پر (Populate) و الصاق می‌شوند.
 *     tags: [VirtualCourse]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: جستجوی متنی در عنوان، توضیحات، دسته‌بندی و شناسه اسپات‌پلیر
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
 *         name: category
 *         schema:
 *           type: string
 *           enum: [فناوری اطلاعات, گرافیک, زبان, MBA]
 *     responses:
 *       200:
 *         description: لیست دوره‌های مجازی با موفقیت دریافت شد
 *
 *   post:
 *     summary: ایجاد دوره مجازی جدید (مدیر سیستم)
 *     tags: [VirtualCourse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVirtualCourseInput'
 *     responses:
 *       201:
 *         description: دوره مجازی با موفقیت ایجاد شد
 *       400:
 *         description: خطای اعتبارسنجی ورودی
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 *
 * /api/virtual-courses/{id}:
 *   get:
 *     summary: دریافت مشخصات یک دوره مجازی با شناسه
 *     tags: [VirtualCourse]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دوره مجازی
 *     responses:
 *       200:
 *         description: مشخصات دوره مجازی با موفقیت دریافت شد
 *       404:
 *         description: دوره مجازی مورد نظر یافت نشد
 *
 *   patch:
 *     summary: ویرایش دوره مجازی (مدیر سیستم)
 *     tags: [VirtualCourse]
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
 *             $ref: '#/components/schemas/UpdateVirtualCourseInput'
 *     responses:
 *       200:
 *         description: دوره مجازی با موفقیت بروزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       404:
 *         description: دوره مجازی مورد نظر یافت نشد
 *
 *   delete:
 *     summary: حذف دوره مجازی (مدیر سیستم)
 *     tags: [VirtualCourse]
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
 *         description: دوره مجازی با موفقیت حذف شد
 *       404:
 *         description: دوره مجازی مورد نظر یافت نشد
 *
 * /api/virtual-courses/{courseId}/discount-codes/{codeId}/toggle:
 *   patch:
 *     summary: فعال یا غیرفعال‌سازی سریع کد تخفیف دوره مجازی (مدیر سیستم)
 *     tags: [VirtualCourse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: codeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: وضعیت کد تخفیف با موفقیت تغییر کرد
 *       404:
 *         description: دوره یا کد تخفیف یافت نشد
 *
 * /api/virtual-courses/{id}/purchase:
 *   post:
 *     summary: خرید دوره آنلاین و صدور خودکار لایسنس اسپات‌پلیر
 *     description: کسر اتمیک مبلغ از کیف پول کاربر و صدور آنی لایسنس در سامانه اسپات‌پلیر
 *     tags: [VirtualCourse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseVirtualCourseInput'
 *     responses:
 *       201:
 *         description: خرید و ثبت‌نام با موفقیت انجام شد
 *       400:
 *         description: موجودی ناکافی یا ثبت‌نام قبلی
 *       404:
 *         description: دوره مورد نظر یافت نشد
 *
 * /api/virtual-courses/{id}/enrollments:
 *   post:
 *     summary: ثبت‌نام مستقیم دستی کاربر در دوره مجازی توسط مدیر
 *     description: ایجاد رکورد ثبت‌نام و تلاش برای صدور لایسنس اسپات‌پلیر بدون تراکنش مالی
 *     tags: [VirtualCourse]
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
 *             $ref: '#/components/schemas/AdminManualEnrollVirtualInput'
 *     responses:
 *       201:
 *         description: کاربر با موفقیت در این دوره مجازی ثبت‌نام شد
 *       400:
 *         description: کاربر قبلاً ثبت‌نام شده است
 *       404:
 *         description: کاربر یا دوره یافت نشد
 */

