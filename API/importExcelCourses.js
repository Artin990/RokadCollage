import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import InPersonCourse from "./Modules/InPersonCourse/InPersonCourseMd.js";
import CourseSession from "./Modules/InPersonCourse/CourseSession/CourseSessionMd.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./config.env") });

const coursesData = [
  {
    title: "ICDL و سواد دیجیتال",
    category: "فناوری اطلاعات",
    tags: ["ICDL", "سواد دیجیتال", "مهارت‌های پایه", "نوجوانان"],
    description: "آموزش جامع ICDL و مهارت‌های سواد دیجیتال ویژه نوجوانان با تمرکز بر مهارت‌های کاربردی کامپیوتر، نرم‌افزارهای اداری و آمادگی برای ورود به دنیای فناوری",
    approximateSessions: "20 جلسه تقریبی",
    totalHours: "40 ساعت",
    duration: "۱۰ هفته",
    scheduleDays: "شنبه و دوشنبه ۱۶:۰۰ تا ۱۸:۰۰",
    price: 3800000,
    tuitionPerPerson: 3800000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۰ آبان",
    approximateEndDate: "۲۲ دی",
    img: "/assets/StatCard/teal.png",
    courseType: "دوره حضوری",
    sessionCode: "ICDL-01",
    sessionDays: "شنبه و دوشنبه",
    sessionHours: "۱۶:۰۰ تا ۱۸:۰۰",
    capacity: 20,
  },
  {
    title: "فتوشاپ",
    category: "فناوری اطلاعات",
    tags: ["فتوشاپ", "گرافیک", "طراحی", "نوجوانان"],
    description: "آموزش کاربردی نرم‌افزار فتوشاپ (Adobe Photoshop) ویژه نوجوانان؛ از مبانی و اصول ادیت عکس تا طراحی پوستر، پست‌های شبکه‌های اجتماعی و خلق آثار دیجیتال",
    approximateSessions: "10 جلسه تقریبی",
    totalHours: "20 ساعت",
    duration: "۵ هفته",
    scheduleDays: "یکشنبه و سه‌شنبه ۱۶:۰۰ تا ۱۸:۰۰",
    price: 4900000,
    tuitionPerPerson: 4900000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۱ آبان",
    approximateEndDate: "۱۵ آذر",
    img: "/assets/StatCard/blue.png",
    courseType: "دوره حضوری",
    sessionCode: "PS-01",
    sessionDays: "یکشنبه و سه‌شنبه",
    sessionHours: "۱۶:۰۰ تا ۱۸:۰۰",
    capacity: 15,
  },
  {
    title: "پریمیر",
    category: "فناوری اطلاعات",
    tags: ["پریمیر", "تدوین", "ویدیو", "نوجوانان"],
    description: "آموزش جامع تدوین و ادیت حرفه‌ای ویدیو با ادوبی پریمیر (Adobe Premiere Pro) ویژه نوجوانان، مناسب برای تولید محتوای ویدیویی، یوتیوب و اینستاگرام",
    approximateSessions: "15 جلسه تقریبی",
    totalHours: "30 ساعت",
    duration: "۷ هفته",
    scheduleDays: "شنبه و دوشنبه ۱۸:۳۰ تا ۲۰:۳۰",
    price: 5400000,
    tuitionPerPerson: 5400000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۰ آبان",
    approximateEndDate: "۲ دی",
    img: "/assets/StatCard/purple.png",
    courseType: "دوره حضوری",
    sessionCode: "PR-01",
    sessionDays: "شنبه و دوشنبه",
    sessionHours: "۱۸:۳۰ تا ۲۰:۳۰",
    capacity: 15,
  },
  {
    title: "افترافکت",
    category: "فناوری اطلاعات",
    tags: ["افترافکت", "موشن گرافیک", "جلوه‌های ویژه", "نوجوانان"],
    description: "آموزش موشن‌گرافیک و جلوه‌های ویژه بصری با افترافکت (Adobe After Effects) برای متحرک‌سازی المان‌ها، ساخت استوری‌موشن و انیمیشن‌های دوبعدی جذاب",
    approximateSessions: "15 جلسه تقریبی",
    totalHours: "30 ساعت",
    duration: "۷ هفته",
    scheduleDays: "یکشنبه و سه‌شنبه ۱۸:۳۰ تا ۲۰:۳۰",
    price: 5900000,
    tuitionPerPerson: 5900000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۱ آبان",
    approximateEndDate: "۳ دی",
    img: "/assets/StatCard/yellow.png",
    courseType: "دوره حضوری",
    sessionCode: "AE-01",
    sessionDays: "یکشنبه و سه‌شنبه",
    sessionHours: "۱۸:۳۰ تا ۲۰:۳۰",
    capacity: 15,
  },
  {
    title: "طراحی سایت با وردپرس",
    category: "فناوری اطلاعات",
    tags: ["وردپرس", "طراحی سایت", "فروشگاه اینترنتی", "نوجوانان"],
    description: "راه‌اندازی و پیاده‌سازی وب‌سایت‌های شرکتی و فروشگاهی با سیستم مدیریت محتوای وردپرس و المنتور بدون نیاز به کدنویسی پیچیده همراه با مفاهیم هاست و دامین",
    approximateSessions: "12 جلسه تقریبی",
    totalHours: "24 ساعت",
    duration: "۶ هفته",
    scheduleDays: "چهارشنبه و پنج‌شنبه ۱۶:۰۰ تا ۱۸:۰۰",
    price: 5500000,
    tuitionPerPerson: 5500000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۴ آبان",
    approximateEndDate: "۲۶ آذر",
    img: "/assets/StatCard/teal.png",
    courseType: "دوره حضوری",
    sessionCode: "WP-01",
    sessionDays: "چهارشنبه و پنج‌شنبه",
    sessionHours: "۱۶:۰۰ تا ۱۸:۰۰",
    capacity: 15,
  },
  {
    title: "طراحی رابط و تجربه کاربری (UI/UX)",
    category: "فناوری اطلاعات",
    tags: ["UI/UX", "طراحی محصول", "فیگما", "نوجوانان"],
    description: "یادگیری اصول تفکر طراحی، تجربه کاربری (UX) و طراحی رابط کاربری (UI) برای وب‌سایت و اپلیکیشن با نرم‌افزار فیگما به‌همراه تمرین‌های کارگاهی تعاملی",
    approximateSessions: "12 جلسه تقریبی",
    totalHours: "24 ساعت",
    duration: "۶ هفته",
    scheduleDays: "چهارشنبه و پنج‌شنبه ۱۸:۳۰ تا ۲۰:۳۰",
    price: 5800000,
    tuitionPerPerson: 5800000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۴ آبان",
    approximateEndDate: "۲۶ آذر",
    img: "/assets/StatCard/blue.png",
    courseType: "دوره حضوری",
    sessionCode: "UIUX-01",
    sessionDays: "چهارشنبه و پنج‌شنبه",
    sessionHours: "۱۸:۳۰ تا ۲۰:۳۰",
    capacity: 15,
  },
  {
    title: "برنامه‌نویسی فرانت‌اند",
    category: "فناوری اطلاعات",
    tags: ["فرانت‌اند", "HTML", "CSS", "جاوااسکریپت", "React", "نوجوانان"],
    description: "مسیر گام‌به‌گام برنامه‌نویسی وب فرانت‌اند با یادگیری HTML5، CSS3، JavaScript مدرن و مبانی فریم‌ورک‌های روز همراه با ساخت پروژه‌های واقعی کارگاهی",
    approximateSessions: "35 جلسه تقریبی",
    totalHours: "70 ساعت",
    duration: "۱۲ هفته",
    scheduleDays: "شنبه، دوشنبه و چهارشنبه ۱۶:۰۰ تا ۱۸:۰۰",
    price: 7900000,
    tuitionPerPerson: 7900000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۰ آبان",
    approximateEndDate: "۳ بهمن",
    img: "/assets/StatCard/purple.png",
    courseType: "دوره حضوری",
    sessionCode: "FED-01",
    sessionDays: "شنبه، دوشنبه و چهارشنبه",
    sessionHours: "۱۶:۰۰ تا ۱۸:۰۰",
    capacity: 18,
  },
  {
    title: "برنامه‌نویسی بک‌اند",
    category: "فناوری اطلاعات",
    tags: ["بک‌اند", "پایتون", "نودجی‌اس", "دیتابیس", "نوجوانان"],
    description: "آموزش برنامه‌نویسی سمت سرور، طراحی پایگاه‌های داده و ایجاد APIهای کاربردی با متدهای استاندارد جهت توانمندسازی نوجوانان در توسعه بک‌اند وب‌سرویس‌ها",
    approximateSessions: "25 جلسه تقریبی",
    totalHours: "50 ساعت",
    duration: "۹ هفته",
    scheduleDays: "یکشنبه، سه‌شنبه و پنج‌شنبه ۱۶:۰۰ تا ۱۸:۰۰",
    price: 8500000,
    tuitionPerPerson: 8500000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۱ آبان",
    approximateEndDate: "۹ دی",
    img: "/assets/StatCard/yellow.png",
    courseType: "دوره حضوری",
    sessionCode: "BED-01",
    sessionDays: "یکشنبه، سه‌شنبه و پنج‌شنبه",
    sessionHours: "۱۶:۰۰ تا ۱۸:۰۰",
    capacity: 18,
  },
  {
    title: "ابزارهای هوش مصنوعی و تولید محتوا",
    category: "فناوری اطلاعات",
    tags: ["هوش مصنوعی", "AI", "تولید محتوا", "ChatGPT", "نوجوانان"],
    description: "تسلط بر ابزارهای نوین هوش مصنوعی (ChatGPT، Midjourney، ابزارهای ساخت تصویر و صدا) جهت تسریع در انجام تکالیف، ایده‌پردازی و خلق محتوای دیجیتال کاربردی",
    approximateSessions: "10 جلسه تقریبی",
    totalHours: "20 ساعت",
    duration: "۵ هفته",
    scheduleDays: "روزهای فرد ۱۶:۰۰ تا ۱۸:۰۰",
    price: 4200000,
    tuitionPerPerson: 4200000,
    proposedTeacher: "اساتید کالج رکاد",
    approximateStartDate: "۱۱ آبان",
    approximateEndDate: "۱۵ آذر",
    img: "/assets/StatCard/teal.png",
    courseType: "دوره حضوری",
    sessionCode: "AI-01",
    sessionDays: "روزهای فرد",
    sessionHours: "۱۶:۰۰ تا ۱۸:۰۰",
    capacity: 15,
  },
];

const joujmanDescription =
  "در انتهای هر دوره، یک جلسه رسمی پروژه‌های نوجوانان با دعوت رسمی از والدین و ۲ الی ۳ نفر از اساتید متخصص در این حوزه برگزار می‌شود که باعث افزایش اعتماد اولیاء، ارزیابی دقیق فنی، سنجش برای جذب در استودیو رکاد و ایجاد حس افتخار و انگیزه در نوجوانان می‌شود.";

const defaultLocation = {
  address: "مشهد - فرامرز عباسی ۳۳",
  googleMapEmbedUrl: "https://maps.google.com",
  neshanEmbedUrl: "https://nshn.ir",
  baladEmbedUrl: "https://balad.ir",
  mapEmbedUrl: "",
};

async function run() {
  const mongoUri =
    process.env.DATA_BASE || "mongodb://127.0.0.1:27017/RokadCollage?directConnection=true";
  console.log("Connecting to MongoDB:", mongoUri);
  await mongoose.connect(mongoUri);
  console.log("Connected successfully!");

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of coursesData) {
    const filter = { title: item.title, type: "حضوری" };

    const updateDoc = {
      category: item.category,
      tags: item.tags,
      title: item.title,
      description: item.description,
      approximateSessions: item.approximateSessions,
      totalHours: item.totalHours,
      duration: item.duration,
      scheduleDays: item.scheduleDays,
      price: item.price,
      tuitionPerPerson: item.tuitionPerPerson,
      proposedTeacher: item.proposedTeacher,
      approximateStartDate: item.approximateStartDate,
      approximateEndDate: item.approximateEndDate,
      img: item.img,
      type: "حضوری",
      courseType: item.courseType,
      joujmanEvent: {
        title: "رویداد پایانی و ژوژمان",
        description: joujmanDescription,
        isActive: true,
      },
      location: defaultLocation,
      timedDiscount: { percentage: 0, startDate: null, endDate: null },
      discountCodes: [],
      sprints: [],
      resources: [],
    };

    let course = await InPersonCourse.findOne(filter);
    if (course) {
      Object.assign(course, updateDoc);
      await course.save();
      updatedCount++;
      console.log(`[UPDATE] Updated course: ${course.title} (ID: ${course._id})`);
    } else {
      course = await InPersonCourse.create(updateDoc);
      createdCount++;
      console.log(`[CREATE] Created course: ${course.title} (ID: ${course._id})`);
    }

    // Ensure session exists
    let session = await CourseSession.findOne({
      course: course._id,
      code: item.sessionCode,
    });

    if (session) {
      session.scheduleDays = item.sessionDays;
      session.scheduleHours = item.sessionHours;
      session.capacity = item.capacity;
      await session.save();
    } else {
      await CourseSession.create({
        course: course._id,
        code: item.sessionCode,
        scheduleDays: item.sessionDays,
        scheduleHours: item.sessionHours,
        capacity: item.capacity,
        enrolledCount: 0,
      });
    }
  }

  console.log("\n=================================");
  console.log(`Done! Created: ${createdCount}, Updated: ${updatedCount}`);
  console.log("All in-person courses are now available in Admin and Frontend!");
  console.log("=================================");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
