import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  purchaseCourse,
  getAllEnrollments,
  getOneEnrollment,
  getMyEnrollments,
  checkEnrollmentStatus,
  adminManualEnroll,
  retryLicense,
} from "./EnrollmentCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import {
  validateRequest,
  validateParams,
  objectIdParamValidator,
  createObjectIdParamsValidator,
} from "../../Utils/validateRequest.js";
import {
  purchaseCourseValidator,
  adminManualEnrollValidator,
} from "./EnrollmentValidation.js";

const enrollmentRouter = Router();

const retryLicenseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: {
    success: false,
    message: "تعداد درخواست‌های تلاش مجدد بیش از حد مجاز است. لطفاً پس از ۱۵ دقیقه مجدداً تلاش کنید",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Retry SpotPlayer license issuance (owner or admin)
enrollmentRouter.post(
  "/:id/retry-license",
  IsLogin,
  validateParams(objectIdParamValidator),
  retryLicenseLimiter,
  retryLicense
);

// Purchase course using wallet balance (authenticated users)
enrollmentRouter.post(
  "/purchase",
  IsLogin,
  validateRequest(purchaseCourseValidator),
  purchaseCourse
);

// Manual enrollment by Admin without wallet deduction
enrollmentRouter.post(
  "/manual",
  IsLogin,
  IsAdmin,
  validateRequest(adminManualEnrollValidator),
  adminManualEnroll
);

// Get all enrollment records (Admin only)
enrollmentRouter.get("/all", IsLogin, IsAdmin, getAllEnrollments);

// Get enrolled courses for the currently authenticated user
enrollmentRouter.get("/my", IsLogin, getMyEnrollments);

// Check enrollment status of the current user for a specific course
enrollmentRouter.get(
  "/status/:courseId",
  IsLogin,
  validateParams(createObjectIdParamsValidator("courseId")),
  checkEnrollmentStatus
);

// Get specific enrollment details (Admin or owner)
enrollmentRouter.get(
  "/:id",
  IsLogin,
  validateParams(objectIdParamValidator),
  getOneEnrollment
);

export default enrollmentRouter;

/**
 * @swagger
 * tags:
 *   - name: Enrollment
 *     description: مدیریت دوره‌های خریداری‌شده، لایسنس اسپات‌پلیر و فرآیند ثبت‌نام کاربران
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SpotplayerLicense:
 *       type: object
 *       properties:
 *         licenseId:
 *           type: string
 *           example: "64f9b8c0e4b0a1a2b3c4d5e6"
 *         key:
 *           type: string
 *           description: کلید لایسنس رمزگذاری‌شده ویدیوها
 *         url:
 *           type: string
 *           description: آدرس پخش یا باز کردن وب‌پلیر
 *         downloadUrl:
 *           type: string
 *           description: لینک مستقیم دانلود نرم‌افزار با لایسنس آماده
 *         status:
 *           type: string
 *           enum: [pending, processing, issued, failed]
 *     Enrollment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: object
 *           description: مشخصات کاربر ثبت‌نام‌شده
 *         course:
 *           type: object
 *           description: مشخصات دوره (حضوری یا مجازی)
 *         courseModel:
 *           type: string
 *           enum: [InPersonCourse, VirtualCourse]
 *         session:
 *           type: object
 *           description: مشخصات جلسه انتخابی (در دوره‌های حضوری)
 *         pricePaid:
 *           type: number
 *           example: 3200000
 *         discountAmount:
 *           type: number
 *           example: 500000
 *         couponCode:
 *           type: string
 *           example: "YALDA"
 *         transactionId:
 *           type: string
 *         spotplayer:
 *           $ref: '#/components/schemas/SpotplayerLicense'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PurchaseCoursePayload:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           description: شناسه دوره (حضوری یا مجازی)
 *         sessionId:
 *           type: string
 *           description: شناسه کد کلاس انتخابی (الزامی برای دوره‌های حضوری)
 *         couponCode:
 *           type: string
 *           description: کد تخفیف دلخواه (اختیاری)
 *     AdminManualEnrollPayload:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: شناسه کاربر
 *         courseId:
 *           type: string
 *           description: شناسه دوره
 *         sessionId:
 *           type: string
 *           description: شناسه کد کلاس (برای دوره‌های حضوری)
 */

/**
 * @swagger
 * /api/enrollments/all:
 *   get:
 *     summary: دریافت فهرست کلیه ثبت‌نام‌های سامانه (مدیر سیستم)
 *     description: |
 *       دریافت لیست تمام ثبت‌نام‌ها.
 *       **نکته پیوند و متغیرهای مجازی:** از آنجا که فیلد `course` چندریختی (`refPath: 'courseModel'`) بوده و به دو مدل InPersonCourse و VirtualCourse اشاره دارد، و همچنین متغیرهای مجازی در ApiFeatures پشتیبانی نمی‌شوند، پیوند اطلاعات دوره به صورت اختصاصی در کنترلر سرور انجام شده و به همراه اطلاعات کاربر (`user`) و کد کلاس (`session`) بازگردانده می‌شود.
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
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
 *         name: course
 *         schema:
 *           type: string
 *         description: فیلتر بر اساس شناسه دوره
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: فیلتر بر اساس شناسه کاربر
 *       - in: query
 *         name: session
 *         schema:
 *           type: string
 *         description: فیلتر بر اساس شناسه کد کلاس
 *       - in: query
 *         name: courseModel
 *         schema:
 *           type: string
 *           enum: [InPersonCourse, VirtualCourse]
 *         description: فیلتر بر اساس نوع دوره
 *     responses:
 *       200:
 *         description: لیست ثبت‌نام‌ها با موفقیت دریافت شد
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 *
 * /api/enrollments/my:
 *   get:
 *     summary: دریافت دوره‌های خریداری‌شده کاربر جاری
 *     description: دریافت لیست دوره‌های فعال کاربر لاگین‌شده همراه با لایسنس اسپات‌پلیر، لینک دانلود و مشخصات دوره و جلسه
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: لیست دوره‌های من با موفقیت دریافت شد
 *       401:
 *         description: عدم احراز هویت
 *
 * /api/enrollments/status/{courseId}:
 *   get:
 *     summary: بررسی وضعیت ثبت‌نام کاربر جاری در یک دوره مشخص
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دوره
 *     responses:
 *       200:
 *         description: وضعیت ثبت‌نام کاربر با موفقیت برگردانده شد
 *       401:
 *         description: عدم احراز هویت
 *
 * /api/enrollments/{id}:
 *   get:
 *     summary: دریافت جزئیات یک رکورد ثبت‌نام
 *     description: مشاهده مشخصات کامل یک ثبت‌نام توسط خریدار دوره یا مدیر سیستم
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه رکورد ثبت‌نام
 *     responses:
 *       200:
 *         description: اطلاعات ثبت‌نام با موفقیت دریافت شد
 *       403:
 *         description: عدم دسترسی به این رکورد
 *       404:
 *         description: ثبت‌نام یافت نشد
 *
 * /api/enrollments/purchase:
 *   post:
 *     summary: خرید دوره با موجودی کیف پول (حضوری یا مجازی)
 *     description: متد عمومی خرید دوره با کسر اتمیک مبلغ از کیف پول و ثبت‌نام کاربر
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseCoursePayload'
 *     responses:
 *       201:
 *         description: خرید و ثبت‌نام با موفقیت انجام شد
 *       400:
 *         description: خطای اعتبارسنجی، موجودی ناکافی، تکمیل ظرفیت یا ثبت‌نام قبلی
 *       404:
 *         description: دوره یا کد کلاس یافت نشد
 *
 * /api/enrollments/manual:
 *   post:
 *     summary: ثبت‌نام مستقیم کاربر توسط مدیر سیستم
 *     description: ایجاد رکورد ثبت‌نام برای کاربر بدون کسر موجودی کیف پول
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminManualEnrollPayload'
 *     responses:
 *       201:
 *         description: کاربر با موفقیت در دوره ثبت‌نام شد
 *       400:
 *         description: خطای اعتبارسنجی یا تکمیل ظرفیت
 *       403:
 *         description: عدم دسترسی
 *       404:
 *         description: کاربر یا دوره یافت نشد
 *
 * /api/enrollments/{id}/retry-license:
 *   post:
 *     summary: تلاش مجدد جهت صدور لایسنس اسپات‌پلیر
 *     description: تلاش مجدد برای دریافت لایسنس در صورت خطای شبکه یا قطعی موقت درگاه اسپات‌پلیر در زمان خرید (محدود به ۱۰ درخواست در ۱۵ دقیقه)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه رکورد ثبت‌نام
 *     responses:
 *       200:
 *         description: نتیجه تلاش مجدد برای صدور لایسنس
 *       400:
 *         description: لایسنس قبلاً صادر شده یا دوره مجازی نیست
 *       403:
 *         description: عدم دسترسی
 *       404:
 *         description: ثبت‌نام یافت نشد
 *       429:
 *         description: تعداد درخواست‌های مجدد بیش از حد مجاز است
 */

