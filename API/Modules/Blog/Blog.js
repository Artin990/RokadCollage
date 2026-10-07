import { Router } from "express";
import rateLimit from "express-rate-limit";
import { create, getAll, getOne, remove, update, preview } from "./BlogCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import {
  validateRequest,
  validateParams,
  validateQuery,
  objectIdParamValidator,
} from "../../Utils/validateRequest.js";
import {
  createBlogValidator,
  updateBlogValidator,
  previewBlogValidator,
  blogQueryValidator,
} from "./BlogValidation.js";

const blogRouter = Router();

/**
 * Rate limiter for preview endpoint to prevent abuse.
 */
const previewRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    message: "تعداد درخواست‌های پیش‌نمایش بیش از حد مجاز است. لطفاً کمی بعد مجدداً تلاش کنید",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// HTML Preview endpoint — must be defined BEFORE /:id
blogRouter.post(
  "/preview",
  IsLogin,
  IsAdmin,
  previewRateLimiter,
  validateRequest(previewBlogValidator),
  preview
);

// Collection endpoints
blogRouter.route("/")
  .get(validateQuery(blogQueryValidator), getAll)
  .post(IsLogin, IsAdmin, validateRequest(createBlogValidator), create);

// Document endpoints
blogRouter.route("/:id")
  .get(validateParams(objectIdParamValidator), getOne)
  .patch(IsLogin, IsAdmin, validateParams(objectIdParamValidator), validateRequest(updateBlogValidator), update)
  .delete(IsLogin, IsAdmin, validateParams(objectIdParamValidator), remove);

export default blogRouter;

/**
 * @swagger
 * tags:
 *   - name: Blog
 *     description: مدیریت مقالات و وبلاگ آموزشی کالج رکاد
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - category
 *         - title
 *         - description
 *         - content
 *         - img
 *       properties:
 *         _id:
 *           type: string
 *         category:
 *           type: string
 *           enum: [گرافیک, مسیر شغلی, MBA, زبان, فرانتاند, بکاند]
 *           example: "فرانتاند"
 *         title:
 *           type: string
 *           example: "راهنمای جامع یادگیری React در سال ۱۴۰۳"
 *         description:
 *           type: string
 *           example: "در این مقاله نقشه راه کامل تبدیل شدن به یک برنامه‌نویس ارشد فرانت‌اند را بررسی می‌کنیم..."
 *         content:
 *           type: string
 *           description: متن کامل مقاله در قالب HTML پاکسازی‌شده و امن
 *           example: "<h2>مقدمه</h2><p>ری‌اکت یکی از محبوب‌ترین کتابخانه‌های جاوااسکریپت است...</p>"
 *         img:
 *           type: string
 *           example: "blog_cover_789.webp"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateBlogInput:
 *       type: object
 *       required:
 *         - category
 *         - title
 *         - description
 *         - content
 *         - img
 *       properties:
 *         category:
 *           type: string
 *           enum: [گرافیک, مسیر شغلی, MBA, زبان, فرانتاند, بکاند]
 *           example: "فرانتاند"
 *         title:
 *           type: string
 *           example: "راهنمای جامع یادگیری React در سال ۱۴۰۳"
 *         description:
 *           type: string
 *           example: "توضیحات کوتاه مقاله..."
 *         content:
 *           type: string
 *           description: متن کامل HTML مقاله (حداکثر ۲۰۰٬۰۰۰ کاراکتر؛ سمت سرور پاکسازی می‌شود)
 *           example: "<h2>سرفصل‌ها</h2><p>متن بخش اول مقاله</p>"
 *         img:
 *           type: string
 *           example: "blog_cover_789.webp"
 *     UpdateBlogInput:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           enum: [گرافیک, مسیر شغلی, MBA, زبان, فرانتاند, بکاند]
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         content:
 *           type: string
 *           description: متن کامل HTML ویرایش‌شده (حداکثر ۲۰۰٬۰۰۰ کاراکتر)
 *         img:
 *           type: string
 *     PreviewBlogInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: متن خام HTML برای پاکسازی و پیش‌نمایش
 *           example: "<h1>عنوان تست</h1><p>متن پاراگراف</p>"
 *     PreviewBlogResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             html:
 *               type: string
 *               example: "<h2>عنوان تست</h2><p>متن پاراگراف</p>"
 */

/**
 * @swagger
 * /api/blog/preview:
 *   post:
 *     summary: پیش‌نمایش زنده و پاکسازی HTML محتوای مقاله (مدیر سیستم)
 *     description: دریافت رشته HTML، اعمال سیاست یکسان پاکسازی سرور و بازگرداندن HTML امن و تمیز
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreviewBlogInput'
 *     responses:
 *       200:
 *         description: پیش‌نمایش محتوا با موفقیت پاکسازی و تولید شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreviewBlogResponse'
 *       400:
 *         description: خطای اعتبارسنجی ورودی یا فراتر رفتن از سقف مجاز
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی (فقط مدیر)
 *       429:
 *         description: تعداد درخواست‌های پیش‌نمایش بیش از حد مجاز است
 *
 * /api/blog:
 *   get:
 *     summary: دریافت فهرست مقالات وبلاگ
 *     description: دریافت مقالات با امکان جستجوی واژه در عنوان، توضیحات و دسته‌بندی، صفحه‌بندی و مرتب‌سازی. فیلد content به صورت پیش‌فرض بازگردانده نمی‌شود.
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: جستجوی متنی در مقالات
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
 *           enum: [گرافیک, مسیر شغلی, MBA, زبان, فرانتاند, بکاند]
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: فهرست مقالات با موفقیت دریافت شد
 *
 *   post:
 *     summary: انتشار مقاله جدید (مدیر سیستم)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogInput'
 *     responses:
 *       201:
 *         description: مقاله با موفقیت منتشر شد
 *       400:
 *         description: عنوان تکراری یا خطای اعتبارسنجی
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 *
 * /api/blog/{id}:
 *   get:
 *     summary: دریافت متن و مشخصات کامل یک مقاله با شناسه (شامل محتوای HTML)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه مقاله
 *     responses:
 *       200:
 *         description: مقاله با موفقیت دریافت شد
 *       404:
 *         description: مقاله مورد نظر یافت نشد
 *
 *   patch:
 *     summary: ویرایش مقاله (مدیر سیستم)
 *     tags: [Blog]
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
 *             $ref: '#/components/schemas/UpdateBlogInput'
 *     responses:
 *       200:
 *         description: مقاله با موفقیت بروزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       404:
 *         description: مقاله مورد نظر یافت نشد
 *
 *   delete:
 *     summary: حذف مقاله (مدیر سیستم)
 *     tags: [Blog]
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
 *         description: مقاله با موفقیت حذف شد
 *       404:
 *         description: مقاله مورد نظر یافت نشد
 */
