import express from "express";
import { removeData, uploadMultiple, uploadSingle } from "./UploadCn.js";
import upload from "../../Utils/Upload.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import IsLogin from "../../Middleware/IsLogin.js";
import convertToWebp from "../../Middleware/convertToWebp.js";

import { validateRequest } from "../../Utils/validateRequest.js";
import { removeFileValidator } from "./UploadValidation.js";

const uploadRouter = express.Router();

uploadRouter.route("/").post(IsLogin, IsAdmin, upload.single("file"), convertToWebp, uploadSingle);
uploadRouter.route("/multi").post(IsLogin, IsAdmin, upload.array("files", 10), convertToWebp, uploadMultiple);
uploadRouter.route("/remove").post(IsLogin, IsAdmin, validateRequest(removeFileValidator), removeData);

export default uploadRouter;

/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: مدیریت آپلود و پاک‌سازی تصاویر و فایل‌ها
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RemoveFileInput:
 *       type: object
 *       required:
 *         - filename
 *       properties:
 *         filename:
 *           type: string
 *           example: "photo_1790322501550.webp"
 *           description: نام فایل جهت حذف از پوشه سرور
 *     UploadSingleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: string
 *           description: نام ذخیره‌شده فایل
 *           example: "photo_1790322501550.webp"
 *     UploadMultipleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: آپلود تکی تصویر (مدیر سیستم)
 *     description: بارگذاری یک فایل تصویری؛ فایل‌های تصویری به صورت خودکار به WebP بهینه‌سازی می‌شوند و فایل‌های SVG در برابر اسکریپت‌های مخرب ضدعفونی می‌گردند.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: فایل تصویر (JPG, PNG, WEBP, SVG)
 *     responses:
 *       201:
 *         description: فایل با موفقیت آپلود شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadSingleResponse'
 *       400:
 *         description: فایلی انتخاب نشده یا پسوند فایل نامعتبر است
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 *
 * /api/upload/multi:
 *   post:
 *     summary: آپلود دسته‌ای تصاویر تا ۱۰ فایل (مدیر سیستم)
 *     description: بارگذاری چندین فایل همزمان با تبدیل خودکار به WebP
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: حداکثر ۱۰ فایل تصویری
 *     responses:
 *       201:
 *         description: فایل‌ها با موفقیت آپلود شدند
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadMultipleResponse'
 *       400:
 *         description: فایلی انتخاب نشده است
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 *
 * /api/upload/remove:
 *   post:
 *     summary: حذف امن فایل تصویر از سرور (مدیر سیستم)
 *     description: حذف فیزیکی یک فایل آپلود شده از پوشه Public سرور (فایل‌های پیش‌فرض و سیستمی قابل حذف نیستند)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveFileInput'
 *     responses:
 *       200:
 *         description: فایل با موفقیت حذف شد
 *       400:
 *         description: نام فایل نامعتبر است
 *       403:
 *         description: عدم اجازه حذف فایل‌های پیش‌فرض سامانه
 *       404:
 *         description: فایل در سرور یافت نشد
 */

