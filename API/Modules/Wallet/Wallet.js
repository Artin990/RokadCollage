import { Router } from "express";
import {
  getMyWallet,
  requestCharge,
  verifyCharge,
  requestPayout,
  getAllWallets,
  getMyTransactions,
  getAllTransactions,
} from "./WalletCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import {
  requestChargeValidator,
  verifyChargeValidator,
  requestPayoutValidator,
} from "./WalletValidation.js";

import rateLimit from "express-rate-limit";

const walletRouter = Router();

const chargeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "تعداد درخواست‌های شارژ بیش از حد مجاز است. لطفاً پس از ۱۰ دقیقه مجدداً تلاش کنید",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// User wallet routes (Authenticated users)
walletRouter.route("/my").get(IsLogin, getMyWallet);
walletRouter.route("/charge/request").post(IsLogin, chargeLimiter, validateRequest(requestChargeValidator), requestCharge);
walletRouter.route("/charge/verify").post(IsLogin, validateRequest(verifyChargeValidator), verifyCharge);
walletRouter.route("/payout/request").post(IsLogin, validateRequest(requestPayoutValidator), requestPayout);
walletRouter.route("/transactions/my").get(IsLogin, getMyTransactions);

// Management routes (Admin and superAdmin only)
walletRouter.route("/all").get(IsLogin, IsAdmin, getAllWallets);
walletRouter.route("/transactions/all").get(IsLogin, IsAdmin, getAllTransactions);

export default walletRouter;

/**
 * @swagger
 * tags:
 *   - name: Wallet
 *     description: مدیریت کیف پول و درگاه پرداخت زرین‌پال
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         ownerId:
 *           type: string
 *           description: شناسه کاربر صاحب کیف پول
 *         balance:
 *           type: number
 *           description: موجودی کیف پول به تومان
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         walletId:
 *           type: string
 *         userId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [charge, payout]
 *         amount:
 *           type: number
 *           description: مبلغ تراکنش به تومان
 *         status:
 *           type: string
 *           enum: [pending, success, failed]
 *         authority:
 *           type: string
 *         refId:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/wallet/my:
 *   get:
 *     summary: دریافت اطلاعات کیف پول کاربر جاری
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: اطلاعات کیف پول با موفقیت دریافت شد
 *       401:
 *         description: عدم احراز هویت
 *
 * /api/wallet/charge/request:
 *   post:
 *     summary: درخواست شارژ آنلاین کیف پول از طریق زرین‌پال
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 50000
 *                 description: مبلغ شارژ به تومان (حداقل ۱۰۰۰ تومان)
 *     responses:
 *       200:
 *         description: شناسه Authority و لینک هدایت به درگاه پرداخت زرین‌پال
 *       400:
 *         description: خطای اعتبارسنجی
 *       500:
 *         description: خطا در ارتباط با درگاه زرین‌پال
 *
 * /api/wallet/charge/verify:
 *   post:
 *     summary: تأیید نهایی پرداخت زرین‌پال و شارژ اتمیک کیف پول
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Authority
 *             properties:
 *               Authority:
 *                 type: string
 *                 description: شناسه بازگشتی زرین‌پال
 *     responses:
 *       200:
 *         description: کیف پول با موفقیت شارژ شد
 *       400:
 *         description: تراکنش نامعتبر یا رد شده توسط درگاه
 *
 * /api/wallet/payout/request:
 *   post:
 *     summary: درخواست تسویه و برداشت موجودی از کیف پول
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 100000
 *                 description: مبلغ تسویه به تومان (حداقل ۵۰۰۰ تومان)
 *               description:
 *                 type: string
 *                 example: شماره شبا جهت واریز IR...
 *     responses:
 *       200:
 *         description: درخواست تسویه با موفقیت ثبت شد
 *       400:
 *         description: موجودی ناکافی یا خطای اعتبارسنجی
 *
 * /api/wallet/transactions/my:
 *   get:
 *     summary: دریافت تاریخچه تراکنش‌های کیف پول کاربر جاری
 *     tags: [Wallet]
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
 *     responses:
 *       200:
 *         description: لیست تراکنش‌های کاربر با موفقیت دریافت شد
 *       401:
 *         description: عدم احراز هویت
 *
 * /api/wallet/all:
 *   get:
 *     summary: دریافت لیست تمام کیف‌پول‌ها (مدیر سیستم)
 *     description: |
 *       دریافت فهرست تمام کیف‌پول‌ها همراه با مشخصات کامل صاحب حساب (`ownerId` شامل نام، شماره، نقش و تاریخ تولد).
 *       **نکته پیوند:** مشخصات مالک به صورت خودکار توسط کنترلر پر (Populate) می‌شود.
 *     tags: [Wallet]
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
 *     responses:
 *       200:
 *         description: لیست تمام کیف‌پول‌ها با اطلاعات کاربران
 *       403:
 *         description: عدم دسترسی
 *
 * /api/wallet/transactions/all:
 *   get:
 *     summary: دریافت لیست تمام تراکنش‌های سیستم (مدیر سیستم)
 *     description: |
 *       گزارش جامع تمام تراکنش‌های بانکی و سیستمی.
 *       **نکته پیوند:** فیلدهای کاربر (`userId`) و کیف پول (`walletId`) به صورت خودکار توسط کنترلر سرور پر (Populate) می‌شوند.
 *     tags: [Wallet]
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
 *     responses:
 *       200:
 *         description: لیست تمام تراکنش‌ها
 *       403:
 *         description: عدم دسترسی
 */

