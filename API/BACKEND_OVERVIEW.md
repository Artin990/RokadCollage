# مستند جامع معماری و راهنمای بک‌اند کالج رکاد (RokadCollage API)

این سند مرجع رسمی معماری، ساختار کد، چرخه‌ی درخواست‌ها و ماتریس کامل اندپوینت‌های سرور بک‌اند کالج رکاد (`RokadCollage/API`) پس از ممیزی، ایمن‌سازی و پاک‌سازی جامع است.

---

## ۱. نقشه ماژول‌ها و ساختار پروژه

پروژه بر پایه‌ی معماری ماژولار مبتنی بر قابلیت‌ها (Feature-based Modular Structure) در محیط Node.js با ساختار ماژول استاندارد ES Modules (`"type": "module"`) پیاده‌سازی شده است.

```
API/
├── Modules/
│   ├── Auth/                 # ثبت‌نام، ورود پیامکی (OTP)، رمز عبور و احراز هویت با JWT
│   ├── User/                 # مدیریت کاربران و سطوح دسترسی (user, admin, superAdmin)
│   ├── Teacher/              # پروفایل مدرسین و رزومه آن‌ها
│   ├── InPersonCourse/       # دوره‌های حضوری، سرفصل‌ها و جلسات (CourseSession)
│   ├── VirtualCourse/        # دوره‌های آنلاین، جلسات و ادغام با اسپات‌پلیر
│   ├── Enrollment/           # ثبت‌نام‌ها، فرآیند خرید، کدهای تخفیف و لایسنس اسپات‌پلیر
│   ├── Wallet/               # کیف پول، تراکنش‌ها، پرداخت آنلاین زرین‌پال و تسویه
│   ├── Blog/                 # وبلاگ و مقالات آموزشی
│   ├── Comment/              # نظرات و رضایت دانشجویان
│   ├── Seo/                  # تنظیمات سئو متا تگ‌ها (Singleton)
│   ├── Upload/               # آپلود امن تصاویر با تبدیل به WebP و اعتبارسنجی SVG
│   └── CourseCore/           # ماژول سنتی مشترک (در حال بازنشستگی تدریجی)
├── Middleware/
│   ├── IsLogin.js            # استخراج توکن از کوکی، اعتبارسنجی HS256 و بارگذاری کاربر
│   ├── IsAdmin.js            # بررسی سطح دسترسی admin یا superAdmin
│   ├── ExportValidation.js   # احراز هویت توکن‌های دانلود یا گزارش
│   └── convertToWebp.js      # بهینه‌سازی تصاویر به فرمت WebP و اسکن امنیتی XSS در SVG
├── Utils/
│   ├── validateRequest.js    # میان‌افزار اعتبارسنجی Joi برای Body، Params و Query
│   ├── SmsHandler.js         # سرویس ارسال پیامک OTP از طریق LimoSMS با ابزار Timeout
│   ├── Upload.js             # پیکربندی حافظه موقت Multer و فیلتر پسوندهای مجاز
│   ├── uploadConfig.js       # تنظیمات اندازه و فرمت فایل‌های آپلودی
│   └── publicFileManager.js  # حذف ایمن فایل‌های اضافی از پوشه Public جهت جلوگیری از نشت فضا
├── Public/                   # فایل‌های استاتیک و تصاویر آپلودشده (محافظت‌شده در برابر اسکریپت)
├── app.js                    # پیکربندی Express، میدل‌ورهای امنیتی و تعریف روت‌ها
├── server.js                 # اتصال به دیتابیس MongoDB، لیسنر پورت و مدیریت خطاهای بحرانی فرآیند
└── .env.example              # نمونه کامل و مستند متغیرهای محیطی
```

### روابط میان ماژول‌ها:
- **Auth ➔ User & Wallet**: در زمان ثبت‌نام پیامکی کاربر جدید، رکورد User ایجاد شده و به‌صورت خودکار یک Wallet با موجودی اولیه صفر برای کاربر تخصیص می‌یابد.
- **InPersonCourse / VirtualCourse ➔ Teacher**: دوره‌ها شناسه‌ی مدرسان را در فیلد `teachers` به عنوان رفرنس ذخیره کرده و در خروجی populate می‌کنند.
- **Enrollment ➔ Wallet & User & Course**: فرآیند خرید دوره‌ها مستقیماً موجودی کیف پول کاربر را بررسی کرده، در صورت کفایت موجودی کسر انجام داده و لایسنس اسپات‌پلیر (برای دوره‌های مجازی) را صادر می‌کند.
- **InPersonCourse ➔ CourseSession**: جلسات دوره‌های حضوری به‌صورت زیرروت تحت روت اصلی دوره مدیریت می‌شوند.

---

## ۲. چرخه‌ی حیات درخواست (Request Lifecycle)

هر درخواست ورودی به سرور مراحل استاندارد و متوالی زیر را طی می‌کند:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Incoming HTTP Request                                                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Global Security Middlewares                                              │
│    - Security Headers (nosniff, SAMEORIGIN, strict-origin-when-cross-origin)│
│    - CORS Config (دامنه مجاز فرانت‌اند + Credentials)                       │
│    - Body Parsers (express.json با سقف 2MB)                                 │
│    - Cookie Parser (استخراج کوکی HttpOnly `Token`)                          │
│    - Static Handler (ارسال هدرهای امنیتی برای فایل‌های /Public)             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Express Router Matching & Rate Limiting                                  │
│    - روت‌های حساس (مثل OTP، Login، Charge، Retry) از Rate Limiter عبور می‌کنند│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Authentication & Authorization Middlewares                               │
│    - IsLogin: تایید امضای HS256 توکن JWT، بازیابی کاربر فعال                │
│    - IsAdmin: بررسی تطابق نقش کاربر با admin یا superAdmin                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. Request Validation (Joi)                                                 │
│    - validateParams: اعتبارسنجی ساختار شناسه‌های ObjectId (۲۴ کاراکتر هگز)   │
│    - validateRequest: اعتبارسنجی فیلدهای Body بر اساس اسکیمای مجاز          │
│    - در صورت خطا: خروج فوری با وضعیت 400 و پیام فارسی کاربرپسند            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 6. Controller Execution & Business Logic                                    │
│    - تراکنش‌های اتمیک دیتابیس (Mongoose / MongoDB)                          │
│    - فراخوانی وب‌سرویس‌های خارجی (LimoSMS, Zarinpal, SpotPlayer) با Timeout │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 7. Unified JSON Response / Error Handling                                   │
│    - موفق: { success: true, message: "...", data: ... }                    │
│    - خطا: وضعیت متناسب (400, 401, 403, 404, 500) و پیام فارسی یکنواخت        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ۳. ماتریس جامع اندپوینت‌ها (Endpoint Matrix)

| متد | مسیر (Route) | سطح دسترسی | اعتبارسنجی (Validation) | شرح عملکرد |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | | | | |
| `POST` | `/api/auth/send-otp` | عمومی (محدود به ۵ در ۲ دقیقه) | `sendOtpValidator` | ارسال کد ۵ رقمی اعتبارسنجی پیامکی |
| `POST` | `/api/auth/verify-otp` | عمومی (محدود به ۵ در ۲ دقیقه) | `verifyOtpValidator` | اعتبارسنجی OTP، ثبت‌نام/ورود، تخصیص کیف پول و ست کوکی JWT |
| `POST` | `/api/auth/login-password` | عمومی (محدود به ۵ در ۱۵ دقیقه) | `loginPasswordValidator` | ورود با شماره تلفن و رمز عبور ثابت |
| `POST` | `/api/auth/set-password` | لاگین‌شده | `setPasswordValidator` | تنظیم یا تغییر رمز عبور کاربر |
| `POST` | `/api/auth/logout` | لاگین‌شده | - | خروج از حساب و پاک کردن کوکی HttpOnly |
| `GET` | `/api/auth/me` | لاگین‌شده | - | دریافت اطلاعات هویتی و نقش کاربر جاری |
| **User** | | | | |
| `GET` | `/api/users` | Admin | - | دریافت فهرست کلیه کاربران سامانه |
| `POST` | `/api/users` | Admin | `createUserValidator` | ایجاد کاربر جدید توسط مدیر |
| `GET` | `/api/users/:id` | مالک یا Admin | `objectIdParamValidator` | دریافت مشخصات کاربر بر اساس شناسه |
| `PATCH` | `/api/users/:id` | مالک یا Admin | `objectIdParamValidator` + `updateUserValidator` | ویرایش اطلاعات پروفایل کاربر |
| `DELETE` | `/api/users/:id` | Admin | `objectIdParamValidator` | حذف کاربر |
| **Teacher** | | | | |
| `GET` | `/api/teachers` | عمومی | - | دریافت لیست کامل اساتید |
| `POST` | `/api/teachers` | Admin | `createTeacherValidator` | ایجاد پروفایل استاد جدید |
| `GET` | `/api/teachers/:id` | عمومی | `objectIdParamValidator` | دریافت اطلاعات یک استاد |
| `PATCH` | `/api/teachers/:id` | Admin | `objectIdParamValidator` + `updateTeacherValidator` | به‌روزرسانی اطلاعات استاد |
| `DELETE` | `/api/teachers/:id` | Admin | `objectIdParamValidator` | حذف استاد |
| **InPersonCourse** | | | | |
| `GET` | `/api/in-person-courses` | عمومی | - | دریافت لیست دوره‌های حضوری فعال |
| `POST` | `/api/in-person-courses` | Admin | `createInPersonCourseValidator` | ایجاد دوره حضوری جدید |
| `GET` | `/api/in-person-courses/:id` | عمومی | `objectIdParamValidator` | دریافت مشخصات دوره حضوری |
| `PATCH` | `/api/in-person-courses/:id` | Admin | `objectIdParamValidator` + `updateInPersonCourseValidator` | ویرایش دوره حضوری |
| `DELETE` | `/api/in-person-courses/:id` | Admin | `objectIdParamValidator` | حذف دوره حضوری (و آیکون مربوطه) |
| `PATCH` | `/api/in-person-courses/:courseId/discount-codes/:codeId/toggle` | Admin | `courseId` + `codeId` ObjectIds | فعال/غیرفعال کردن سریع کد تخفیف دوره حضوری |
| `POST` | `/api/in-person-courses/:id/purchase` | لاگین‌شده | `objectIdParamValidator` + `purchaseInPersonCourseValidator` | خرید دوره حضوری از موجودی کیف پول |
| `GET` | `/api/in-person-courses/:courseId/sessions` | عمومی | `courseId` ObjectId | دریافت جلسات و سرفصل‌های دوره حضوری |
| `POST` | `/api/in-person-courses/:courseId/sessions` | Admin | `courseId` + `createSessionValidator` | افزودن جلسه جدید به دوره حضوری |
| `PATCH` | `/api/in-person-courses/:courseId/sessions/:sessionId` | Admin | `courseId` + `sessionId` + `updateSessionValidator` | ویرایش اطلاعات جلسه حضوری |
| `DELETE` | `/api/in-person-courses/:courseId/sessions/:sessionId` | Admin | `courseId` + `sessionId` ObjectIds | حذف جلسه حضوری |
| `POST` | `/api/in-person-courses/:courseId/sessions/:sessionId/enrollments` | Admin | `sessionId` + `adminManualEnrollValidator` | ثبت‌نام دستی کاربر در جلسه حضوری |
| **VirtualCourse** | | | | |
| `GET` | `/api/virtual-courses` | عمومی | - | دریافت لیست دوره‌های آنلاین و مجازی |
| `POST` | `/api/virtual-courses` | Admin | `createVirtualCourseValidator` | ایجاد دوره مجازی جدید |
| `GET` | `/api/virtual-courses/:id` | عمومی | `objectIdParamValidator` | دریافت مشخصات دوره مجازی |
| `PATCH` | `/api/virtual-courses/:id` | Admin | `objectIdParamValidator` + `updateVirtualCourseValidator` | ویرایش دوره مجازی |
| `DELETE` | `/api/virtual-courses/:id` | Admin | `objectIdParamValidator` | حذف دوره مجازی (و آیکون مربوطه) |
| `PATCH` | `/api/virtual-courses/:courseId/discount-codes/:codeId/toggle` | Admin | `courseId` + `codeId` ObjectIds | فعال/غیرفعال کردن سریع کد تخفیف دوره مجازی |
| `POST` | `/api/virtual-courses/:id/purchase` | لاگین‌شده | `objectIdParamValidator` + `purchaseVirtualCourseValidator` | خرید دوره آنلاین و صدور خودکار لایسنس اسپات‌پلیر |
| `POST` | `/api/virtual-courses/:id/enrollments` | Admin | `objectIdParamValidator` + `adminManualEnrollValidator` | ثبت‌نام دستی کاربر در دوره آنلاین توسط مدیر |
| **Enrollment** | | | | |
| `POST` | `/api/enrollments/purchase` | لاگین‌شده | `purchaseCourseValidator` | متد عمومی خرید دوره با کیف پول (Core) |
| `POST` | `/api/enrollments/manual` | Admin | `adminManualEnrollValidator` | ثبت‌نام مستقیم بدون کسر موجودی |
| `GET` | `/api/enrollments/all` | Admin | - | دریافت لیست کلیه ثبت‌نام‌های سیستم |
| `GET` | `/api/enrollments/my` | لاگین‌شده | - | دریافت دوره‌های خریداری‌شده کاربر جاری |
| `GET` | `/api/enrollments/status/:courseId` | لاگین‌شده | `courseId` ObjectId | بررسی وضعیت ثبت‌نام کاربر در دوره |
| `GET` | `/api/enrollments/:id` | مالک یا Admin | `objectIdParamValidator` | دریافت جزئیات یک رکورد ثبت‌نام |
| `POST` | `/api/enrollments/:id/retry-license` | مالک یا Admin (محدود به ۱۰ در ۱۵ دقیقه) | `objectIdParamValidator` | تلاش مجدد برای صدور لایسنس اسپات‌پلیر ناموفق |
| **Wallet** | | | | |
| `GET` | `/api/wallet/my` | لاگین‌شده | - | دریافت موجودی و اطلاعات کیف پول جاری |
| `POST` | `/api/wallet/charge/request` | لاگین‌شده (محدود به ۱۰ در ۱۰ دقیقه) | `requestChargeValidator` | درخواست شارژ آنلاین و دریافت لینک درگاه زرین‌پال |
| `POST` | `/api/wallet/charge/verify` | لاگین‌شده | `verifyChargeValidator` | تایید تراکنش زرین‌پال و شارژ اتمیک و امن کیف پول |
| `POST` | `/api/wallet/payout/request` | لاگین‌شده | `requestPayoutValidator` | ثبت درخواست تسویه و برداشت وجه |
| `GET` | `/api/wallet/transactions/my` | لاگین‌شده | - | مشاهده تاریخچه تراکنش‌های کاربر جاری |
| `GET` | `/api/wallet/all` | Admin | - | مشاهده وضعیت کلیه کیف‌پول‌ها در سامانه |
| `GET` | `/api/wallet/transactions/all` | Admin | - | گزارش کامل کلیه تراکنش‌های بانکی و سیستمی |
| **Blog** | | | | |
| `GET` | `/api/blogs` | عمومی | `blogQueryValidator` | دریافت لیست مقالات وبلاگ (فیلد content به‌صورت پیش‌فرض مستثنی می‌شود) |
| `POST` | `/api/blogs/preview` | Admin (محدود به ۳۰ در دقیقه) | `previewBlogValidator` | پیش‌نمایش و پاک‌سازی بلادرنگ محتوای HTML مقاله (بدون ذخیره‌سازی) |
| `POST` | `/api/blogs` | Admin | `createBlogValidator` | انتشار مقاله جدید (با محتوای HTML پاک‌سازی‌شده سمت سرور) |
| `GET` | `/api/blogs/:id` | عمومی | `objectIdParamValidator` | دریافت متن و مشخصات کامل مقاله (شامل محتوای کامل HTML) |
| `PATCH` | `/api/blogs/:id` | Admin | `objectIdParamValidator` + `updateBlogValidator` | ویرایش مقاله و اعمال مجدد پاک‌سازی روی محتوا |
| `DELETE` | `/api/blogs/:id` | Admin | `objectIdParamValidator` | حذف مقاله همراه با حذف امن فایل تصویر شاخص |
| **Comment** | | | | |
| `GET` | `/api/comments` | عمومی | - | دریافت لیست نظرات دانشجویان |
| `POST` | `/api/comments` | Admin | `createCommentValidator` | ثبت نظر یا رضایت جدید |
| `GET` | `/api/comments/:id` | عمومی | `objectIdParamValidator` | مشاهده یک نظر |
| `PATCH` | `/api/comments/:id` | Admin | `objectIdParamValidator` + `updateCommentValidator` | ویرایش نظر |
| `DELETE` | `/api/comments/:id` | Admin | `objectIdParamValidator` | حذف نظر |
| **Seo** | | | | |
| `GET` | `/api/seo` | عمومی | - | دریافت تگ‌ها و تنظیمات سئو (Singleton) |
| `PATCH` | `/api/seo` | Admin | `updateSeoValidator` | ویرایش تنظیمات سئو سایت |
| **Upload** | | | | |
| `POST` | `/api/upload` | Admin | `Multer` + `convertToWebp` | آپلود تکی تصویر (تبدیل به WebP یا ضدعفونی SVG) |
| `POST` | `/api/upload/multi` | Admin | `Multer (max 10)` + `convertToWebp` | آپلود دسته‌ای تصاویر تا ۱۰ فایل همزمان |
| `POST` | `/api/upload/remove` | Admin | `removeFileValidator` | حذف فیزیکی و امن فایل از دیسک سرور |

---

## ۴. روندهای کلیدی سیستم (Key Workflows)

### الف. خرید دوره و ثبت‌نام دانشجو (Course Purchase & Enrollment)
1. **بررسی دوره و ظرفیت**: کنترل فعال بودن دوره، بررسی ظرفیت باقی‌مانده (در دوره‌های حضوری) و ثبت‌نام‌نکردن قبلی دانشجو.
2. **محاسبه قیمت نهایی**: اعمال تخفیف عمومی دوره (در صورت وجود تاریخ معتبر) + بررسی و اعمال کد تخفیف اختصاصی (در صورت ارسال توسط کاربر).
3. **کسر اتمیک از کیف پول**:
   - بررسی `balance >= finalPrice`.
   - کسر مبلغ از کیف پول با عملیات اتمیک `findOneAndUpdate` یا تراکنش Session دیتابیس MongoDB.
4. **ثبت رکورد Enrollment**: ایجاد رکورد ثبت‌نام با وضعیت `active`، ثبت مبلغ پرداخت‌شده و شناسه دوره/جلسه.
5. **صدور لایسنس در دوره‌های مجازی**:
   - در صورت مجازی بودن دوره، فراخوانی وب‌سرویس SpotPlayer جهت تولید کلید لایسنس.
   - در صورت موفقیت: ذخیره `spotplayerLicenseId` و `spotplayerLicenseKey` در رکورد ثبت‌نام.
   - در صورت خطای موقت SpotPlayer: ثبت وضعیت `licenseStatus: "failed"` بدون لغو ثبت‌نام، تا دانشجو یا مدیر بتواند با یک کلیک فرآیند صدور لایسنس را Retry کند.

### ب. شارژ آنلاین کیف پول از طریق زرین‌پال (Wallet Charge & Verification)
1. **ثبت درخواست شارژ (`/charge/request`)**:
   - دریافت مبلغ (حداقل ۱۰۰۰ تومان).
   - تماس با API زرین‌پال (`/v4/payment/request.json`) با مهلت زمانی ۱۵ ثانیه (`AbortSignal.timeout`).
   - ذخیره تراکنش با وضعیت `pending` و مقدار شناسه `authority`.
   - بازگرداندن لینک درگاه پرداخت به کاربر.
2. **تایید بازگشت از درگاه (`/charge/verify`)**:
   - گارد انحصار و پیشگیری از Race Condition: قفل تراکنش در دیتابیس با شرط اتمیک `{ authority, status: "pending" }`. اگر تراکنش قبلاً Verify شده باشد، بلافاصله رد می‌شود (Idempotent).
   - تماس با وب‌سرویس زرین‌پال (`/v4/payment/verify.json`) جهت تایید تسویه بانکی.
   - در صورت تایید: به‌روزرسانی تراکنش به `status: "success"` و افزایش موجودی کیف پول کاربر با دستور `$inc: { balance: amount }`.

### ج. تلاش مجدد صدور لایسنس اسپات‌پلیر (`/retry-license`)
- در صورت بروز قطعی اینترنت یا خطای شبکه با سرور SpotPlayer در لحظه خرید، کاربر هزینه‌ای دوباره پرداخت نمی‌کند.
- دانشجو یا مدیر می‌تواند اندپوینت `POST /api/enrollments/:id/retry-license` را فراخوانی کند.
- این اندپوینت مجهز به Rate Limiter اختصاصی (۱۰ درخواست در ۱۵ دقیقه) است تا از اسپم سرور اسپات‌پلیر پیشگیری شود.
- پس از دریافت موفقیت‌آمیز کلید از اسپات‌پلیر، رکورد ثبت‌نام به وضعیت `licenseStatus: "completed"` تغییر می‌یابد.

---

## ۵. راهنمای متغیرهای محیطی (Environment Variables)

کلیه متغیرهای محیطی در فایل `.env.example` مستند شده‌اند:

| نام متغیر | الزامی؟ | مقدار نمونه | شرح و نکات امنیتی |
| :--- | :--- | :--- | :--- |
| `PORT` | خیر | `3000` | پورت گوش‌دادن سرور Express (پیش‌فرض: ۳۰۰۰) |
| `DATA_BASE` | **بله** | `mongodb://127.0.0.1:27017/rokad` | آدرس اتصال به پایگاه داده MongoDB |
| `JWT_SECRET` | **بله** | `a_strong_random_secret_32chars` | کلید خصوصی امضای توکن‌های JWT (الگوریتم HS256) |
| `JWT_EXPIRES_IN`| خیر | `30d` | مدت زمان اعتبار توکن احراز هویت |
| `FRONTEND_URL` | خیر | `http://localhost:5173` | دامنه مجاز فرانت‌اند در CORS برای اجازه ارسال کوکی |
| `COOKIE_SECURE` | خیر | `false` | در محیط Production باید `true` باشد تا کوکی فقط روی HTTPS ارسال شود |
| `LIMO_SMS_API_KEY`| خیر | `limo_api_key_here` | کلید وب‌سرویس سامانه پیامک لیمو اس‌ام‌اس |
| `ZARINPAL_MERCHANT_ID`| خیر | `xxxx-xxxx-xxxx-xxxx` | کد درگاه پرداخت زرین‌پال (برای حالت آزمایشی خالی بماند) |
| `ZARINPAL_CALLBACK_URL`| خیر | `http://localhost:5173/wallet/verify` | نشانی بازگشت کاربر پس از درگاه بانک |
| `SPOTPLAYER_API_KEY` | خیر | `spotplayer_api_key_here` | کلید دسترسی به وب‌سرویس حفاظت ویدیویی SpotPlayer |

---

## ۶. تصمیمات کلیدی معماری و چرایی آن‌ها (Architectural Decisions)

1. **استقلال کامل دوره‌های حضوری و مجازی (No Shared Abstraction)**:
   - دوره‌های حضوری وابستگی عمیق به ظرفیت فیزیکی، زمان‌بندی جلسات، لوکیشن و مدیریت جلسات دارند، در حالی که دوره‌های مجازی به زیرساخت آنلاین، صدور لایسنس اسپات‌پلیر و متادیتاهای ویدیویی وابسته‌اند. ترکیب مصنوعی این دو نوع دوره، پیچیدگی را به‌شدت افزایش می‌داد؛ بنابراین طبق دستور صریح معماری، این دو ماژول کاملاً مستقل و تمیز نگهداری شدند.
2. **قانون جلوگیری از پیچیدگی مازاد (Anti-Complexity Rule)**:
   - هیچ کلاس واسط، سرویس انتزاعی یا لایه اضافه تعریف نشده است مگر در مواردی که حداقل ۳ بار در بخش‌های مجزا استفاده شده باشد (مانند `validateRequest` و `removePublicFile`).
3. **ایمنی در برابر همروندی (Concurrency Safety)**:
   - شارژ کیف‌پول و تایید زرین‌پال با الگوی گارد اتمیک (`findOneAndUpdate` با شرط وضعیت `pending`) پیاده‌سازی شده تا تحت هیچ شرایطی امکان شارژ دوباره با شناسه تکراری یا Race Condition وجود نداشته باشد.
4. **حفاظت چندلایه‌ای بارگذاری و تزریق فایل (Upload Hardening)**:
   - کلیه تصاویر ورودی تبدیل به WebP می‌شوند. فایل‌های SVG که ماهیت متنی دارند در برابر برچسب‌های مخرب `<script>`، اتریبیوت‌های جاوااسکریپت `on*` و پروتکل‌های `javascript:` ممیزی و در صورت آلودگی بلافاصله رد می‌شوند.
5. **ارورهای کاربرپسند فارسی و سورس‌کد با کامنت‌های کوتاه انگلیسی**:
   - پیام‌های خطای نمایشی به کاربر نهایی تماماً با ادبیات فارسی روان و استاندارد حفظ شده‌اند، در حالی که کامنت‌های درون کد به زبان انگلیسی مختصر و با تمرکز بر «چرایی» پیاده‌سازی نگارش شده‌اند.
