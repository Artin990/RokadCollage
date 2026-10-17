import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    remove,
    update,
    toggleDiscountCode,
    purchaseInPersonCourse,
} from "./InPersonCourseCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import {
    validateRequest,
    validateParams,
    objectIdParamValidator,
    createObjectIdParamsValidator,
} from "../../Utils/validateRequest.js";
import {
    createInPersonCourseValidator,
    updateInPersonCourseValidator,
    purchaseInPersonCourseValidator,
} from "./InPersonCourseValidation.js";
import courseSessionRouter from "./CourseSession/CourseSession.js";

const inPersonCourseRouter = Router();

// Quick toggle active state of a course discount code
// PATCH /in-person-courses/:courseId/discount-codes/:codeId/toggle
inPersonCourseRouter.patch(
    "/:courseId/discount-codes/:codeId/toggle",
    IsLogin,
    IsAdmin,
    validateParams(createObjectIdParamsValidator("courseId", "codeId")),
    toggleDiscountCode
);

// Nested course sessions router
// /in-person-courses/:courseId/sessions
inPersonCourseRouter.use(
    "/:courseId/sessions",
    validateParams(createObjectIdParamsValidator("courseId")),
    courseSessionRouter
);

// Purchase in-person course
inPersonCourseRouter.post(
    "/:id/purchase",
    IsLogin,
    validateParams(objectIdParamValidator),
    validateRequest(purchaseInPersonCourseValidator),
    purchaseInPersonCourse
);

inPersonCourseRouter
    .route("/")
    .get(getAll)
    .post(IsLogin, IsAdmin, validateRequest(createInPersonCourseValidator), create);

inPersonCourseRouter
    .route("/:id")
    .get(validateParams(objectIdParamValidator), getOne)
    .patch(IsLogin, IsAdmin, validateParams(objectIdParamValidator), validateRequest(updateInPersonCourseValidator), update)
    .delete(IsLogin, IsAdmin, validateParams(objectIdParamValidator), remove);

export default inPersonCourseRouter;

/**
 * @swagger
 * tags:
 *   - name: InPersonCourse
 *     description: مدیریت دوره‌های حضوری، سرفصل‌ها، تخفیف‌ها و فرآیند خرید حضوری
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseSprint:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           example: "هفته ۱: مبانی و اصول طراحی"
 *         description:
 *           type: string
 *           example: "آشنایی با مفاهیم رنگ‌شناسی، تایپوگرافی و ساختار گرافیکی"
 *     CourseDiscountCode:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         code:
 *           type: string
 *           example: "NOROOZ1403"
 *         title:
 *           type: string
 *           example: "تخفیف عید نوروز"
 *         percentage:
 *           type: number
 *           example: 20
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *           default: true
 *     CourseTimedDiscount:
 *       type: object
 *       properties:
 *         percentage:
 *           type: number
 *           example: 15
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *     CourseLocation:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           example: "مشهد، بلوار سجاد، خیابان بهارستان، پلاک ۱۲"
 *         googleMapEmbedUrl:
 *           type: string
 *         neshanEmbedUrl:
 *           type: string
 *         baladEmbedUrl:
 *           type: string
 *         mapEmbedUrl:
 *           type: string
 *     CourseSessionInput:
 *       type: object
 *       required:
 *         - code
 *         - scheduleDays
 *         - scheduleHours
 *         - capacity
 *       properties:
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
 *     InPersonCourse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         category:
 *           type: string
 *           enum: [فناوری اطلاعات, گرافیک, زبان, MBA, مشاوره]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         title:
 *           type: string
 *           example: "دوره جامع طراحی رابط کاربری (UI/UX)"
 *         description:
 *           type: string
 *         duration:
 *           type: string
 *           example: "۱۰ هفته"
 *         img:
 *           type: string
 *           description: نام فایل تصویر دوره
 *         price:
 *           type: number
 *           example: 4500000
 *         type:
 *           type: string
 *           example: "حضوری"
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
 *         location:
 *           $ref: '#/components/schemas/CourseLocation'
 *         sessions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseSession'
 *         finalPrice:
 *           type: number
 *           description: قیمت محاسبه‌شده با کسر تخفیف زمان‌دار فعال
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
 *     CreateInPersonCourseInput:
 *       type: object
 *       required:
 *         - category
 *         - title
 *         - description
 *         - duration
 *         - img
 *         - sessions
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
 *         img:
 *           type: string
 *         price:
 *           type: number
 *           default: 0
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
 *             description: شناسه ObjectId مدرس
 *         sprints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseSprint'
 *         location:
 *           $ref: '#/components/schemas/CourseLocation'
 *         sessions:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/CourseSessionInput'
 *     UpdateInPersonCourseInput:
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
 *         img:
 *           type: string
 *         price:
 *           type: number
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
 *         location:
 *           $ref: '#/components/schemas/CourseLocation'
 *         sessions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseSessionInput'
 *     PurchaseInPersonCourseInput:
 *       type: object
 *       required:
 *         - sessionId
 *       properties:
 *         sessionId:
 *           type: string
 *           description: شناسه کد کلاس انتخابی
 *         couponCode:
 *           type: string
 *           description: کد تخفیف دلخواه
 */

/**
 * @swagger
 * /api/in-person-courses:
 *   get:
 *     summary: دریافت فهرست دوره‌های حضوری فعال
 *     description: |
 *       دریافت لیست دوره‌های حضوری با امکان جستجو در عنوان، دسته‌بندی و تگ‌ها.
 *       **نکته پیوند و متغیرهای مجازی:** مدرسین (`teachers`) و همچنین جلسات (`sessions`) با احتساب ظرفیت باقیمانده به صورت خودکار توسط کنترلر پر (Populate) و الصاق می‌شوند و نیازی به ارسال پارامتر populate نیست.
 *     tags: [InPersonCourse]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: جستجوی متنی در عنوان، توضیحات و دسته‌بندی
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
 *         description: لیست دوره‌های حضوری با موفقیت دریافت شد
 *
 *   post:
 *     summary: ایجاد دوره حضوری جدید (مدیر سیستم)
 *     description: ثبت دوره حضوری جدید به همراه حداقل یک جلسه اولیه
 *     tags: [InPersonCourse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInPersonCourseInput'
 *     responses:
 *       201:
 *         description: دوره حضوری با موفقیت ایجاد شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 *
 * /api/in-person-courses/{id}:
 *   get:
 *     summary: دریافت جزئیات یک دوره حضوری با شناسه
 *     description: دریافت اطلاعات دوره حضوری همراه با لیست کامل جلسات، مدرسین و محاسبه قیمت نهایی با تخفیف
 *     tags: [InPersonCourse]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دوره حضوری
 *     responses:
 *       200:
 *         description: مشخصات دوره با موفقیت دریافت شد
 *       404:
 *         description: دوره حضوری مورد نظر یافت نشد
 *
 *   patch:
 *     summary: ویرایش دوره حضوری (مدیر سیستم)
 *     tags: [InPersonCourse]
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
 *             $ref: '#/components/schemas/UpdateInPersonCourseInput'
 *     responses:
 *       200:
 *         description: دوره حضوری با موفقیت بروزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       404:
 *         description: دوره حضوری مورد نظر یافت نشد
 *
 *   delete:
 *     summary: حذف دوره حضوری (مدیر سیستم)
 *     description: حذف دوره، آیکون مربوطه و جلسات متصل به آن
 *     tags: [InPersonCourse]
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
 *         description: دوره حضوری با موفقیت حذف شد
 *       404:
 *         description: دوره حضوری مورد نظر یافت نشد
 *
 * /api/in-person-courses/{courseId}/discount-codes/{codeId}/toggle:
 *   patch:
 *     summary: فعال یا غیرفعال‌سازی سریع کد تخفیف دوره حضوری (مدیر سیستم)
 *     tags: [InPersonCourse]
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
 * /api/in-person-courses/{id}/purchase:
 *   post:
 *     summary: خرید و ثبت‌نام در دوره حضوری با کیف پول
 *     description: کسر اتمیک هزینه دوره از کیف پول کاربر و رزرو صندلی در جلسه انتخاب‌شده
 *     tags: [InPersonCourse]
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
 *             $ref: '#/components/schemas/PurchaseInPersonCourseInput'
 *     responses:
 *       201:
 *         description: خرید و ثبت‌نام در دوره حضوری با موفقیت انجام شد
 *       400:
 *         description: موجودی ناکافی، تکمیل ظرفیت یا ثبت‌نام تکراری
 *       404:
 *         description: دوره یا جلسه یافت نشد
 */

