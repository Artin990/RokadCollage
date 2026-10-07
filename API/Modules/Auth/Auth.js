import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  auth,
  forgetPassword,
  loginWithOtp,
  loginWithPassword,
  resendCode,
} from "./AuthCn.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import {
  authValidator,
  forgetPasswordValidator,
  loginWithOtpValidator,
  loginWithPasswordValidator,
  resendCodeValidator,
} from "./AuthValidation.js";

const authRouter = Router();

// SMS sending rate limiter: prevents SMS flooding attacks
const smsRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 6, // 6 attempts per 10 minutes
  message: {
    success: false,
    message: "تعداد درخواست‌های ارسال کد تایید بیش از حد مجاز است. لطفاً پس از ۱۰ دقیقه مجدداً تلاش کنید",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login attempts rate limiter: protects against password brute force
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 attempts per 15 minutes
  message: {
    success: false,
    message: "تعداد تلاش‌های ناموفق ورود بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر تلاش کنید",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.route("/").post(smsRateLimiter, validateRequest(authValidator), auth);
authRouter.route("/login-password").post(loginRateLimiter, validateRequest(loginWithPasswordValidator), loginWithPassword);
authRouter.route("/login-otp").post(loginRateLimiter, validateRequest(loginWithOtpValidator), loginWithOtp);
authRouter.route("/resend-code").post(smsRateLimiter, validateRequest(resendCodeValidator), resendCode);
authRouter.route("/forget-password").post(smsRateLimiter, validateRequest(forgetPasswordValidator), forgetPassword);

export default authRouter;

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: احراز هویت، ارسال پیامک OTP و مدیریت ورود کاربران
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 *         birthDate:
 *           type: string
 *     AuthCheckInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *           description: شماره موبایل معتبر ایران
 *     LoginPasswordInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - password
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         password:
 *           type: string
 *           format: password
 *           example: "12345678"
 *     LoginOtpInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "12345"
 *           description: کد ۵ یا ۶ رقمی پیامک‌شده
 *         password:
 *           type: string
 *           format: password
 *           description: رمز عبور دلخواه برای تنظیم در حساب (اختیاری)
 *     ResendCodeInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *     ForgetPasswordInput:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *         - newPassword
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "12345"
 *         newPassword:
 *           type: string
 *           format: password
 *           example: "NewStrongPass123"
 *           description: رمز عبور جدید (حداقل ۸ کاراکتر)
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             user:
 *               $ref: '#/components/schemas/AuthUser'
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: بررسی وضعیت شماره موبایل و ارسال کد اعتبارسنجی پیامکی (OTP)
 *     description: در صورتی که کاربر قبلاً رمز عبور تعیین کرده باشد، پیام درخواست رمز عبور داده می‌شود؛ در غیر اینصورت کد OTP پیامک می‌گردد. (محدود به ۶ درخواست در ۱۰ دقیقه)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthCheckInput'
 *     responses:
 *       200:
 *         description: وضعیت کاربر یا نتیجه ارسال کد تایید
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     isNewUser:
 *                       type: boolean
 *                     havePassword:
 *                       type: boolean
 *       400:
 *         description: شماره موبایل نامعتبر است
 *       429:
 *         description: تعداد درخواست‌های ارسال پیامک بیش از حد مجاز است
 *       500:
 *         description: خطا در سرویس ارسال پیامک
 *
 * /api/auth/login-password:
 *   post:
 *     summary: ورود به سامانه با شماره موبایل و رمز عبور ثابت
 *     description: ورود کاربرانی که رمز عبور ثابت تعیین کرده‌اند. (محدود به ۱۵ درخواست در ۱۵ دقیقه)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginPasswordInput'
 *     responses:
 *       200:
 *         description: ورود با موفقیت انجام شد و توکن صادر شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: برای این حساب رمز عبور تنظیم نشده است
 *       401:
 *         description: شماره موبایل یا رمز عبور اشتباه است
 *       429:
 *         description: تعداد تلاش‌های ورود بیش از حد مجاز است
 *
 * /api/auth/login-otp:
 *   post:
 *     summary: ورود یا ثبت‌نام با کد تایید پیامکی (OTP)
 *     description: اعتبارسنجی کد پیامک‌شده؛ در صورت نبودن کاربر حساب جدید ساخته می‌شود. امکان تنظیم اختیاری رمز عبور نیز وجود دارد.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginOtpInput'
 *     responses:
 *       200:
 *         description: احراز هویت با موفقیت انجام شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: کد تایید اشتباه یا منقضی شده است
 *
 * /api/auth/resend-code:
 *   post:
 *     summary: ارسال مجدد کد تایید پیامکی
 *     description: ارسال مجدد کد تایید OTP (محدود به ۶ درخواست در ۱۰ دقیقه)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendCodeInput'
 *     responses:
 *       200:
 *         description: کد تایید مجدداً ارسال شد
 *       400:
 *         description: شماره موبایل نامعتبر است
 *       429:
 *         description: محدودیت تعداد درخواست
 *       500:
 *         description: خطا در سرویس پیامک
 *
 * /api/auth/forget-password:
 *   post:
 *     summary: بازنشانی و تغییر رمز عبور با کد پیامکی
 *     description: تغییر رمز عبور در صورت فراموشی با استفاده از کد تایید پیامک‌شده
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordInput'
 *     responses:
 *       200:
 *         description: رمز عبور با موفقیت تغییر کرد
 *       400:
 *         description: کد تایید اشتباه است یا اعتبارسنجی شکست خورد
 *       404:
 *         description: کاربری با این شماره یافت نشد
 */
