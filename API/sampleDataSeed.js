import mongoose from "mongoose";
import dotenv from "dotenv";
import InPersonCourse from "./Modules/InPersonCourse/InPersonCourseMd.js";
import VirtualCourse from "./Modules/VirtualCourse/VirtualCourseMd.js";
import Blog from "./Modules/Blog/BlogMd.js";

dotenv.config({ path: "./config.env" });

async function seedData() {
  try {
    await mongoose.connect(process.env.DATA_BASE);
    console.log("✅ Connected to Database for Sample Seeding.");

    // 1. دوره‌های حضوری
    const inPersonCount = await InPersonCourse.countDocuments();
    if (inPersonCount === 0) {
      await InPersonCourse.create([
        {
          title: "بوت‌کمپ جامع فرانت‌اند و React",
          category: "فناوری اطلاعات",
          tags: ["فرانت‌اند", "React", "Next.js"],
          description: "مسیر کامل صفر تا صد ورود به بازار کار طراحی وب با پروژه‌های واقعی و منتورینگ حضوری",
          duration: "۱۶ هفته",
          price: 12500000,
          img: "/assets/StatCard/teal.png",
          location: { address: "تهران، میدان آزادی، بلوار اکبری، کالج رکاد" },
        },
        {
          title: "کارگاه تخصصی طراحی UI/UX با فیگما",
          category: "فناوری اطلاعات",
          tags: ["UI/UX", "فیگما", "دیزاین سیستم"],
          description: "آموزش اصول تجربه کاربری، رابط کاربری و آماده‌سازی فایل برای برنامه‌نویسان",
          duration: "۱۰ هفته",
          price: 9800000,
          img: "/assets/StatCard/blue.png",
          location: { address: "تهران، میدان آزادی، بلوار اکبری، کالج رکاد" },
        },
      ]);
      console.log("✅ Sample InPerson courses seeded.");
    }

    // 2. دوره‌های آنلاین و مجازی
    const virtualCount = await VirtualCourse.countDocuments();
    if (virtualCount === 0) {
      await VirtualCourse.create([
        {
          title: "دوره جامع طراحی سایت با وردپرس",
          category: "فناوری اطلاعات",
          tags: ["وردپرس", "فروشگاهی", "المنتور"],
          description: "راه‌اندازی سایت‌های پیشرفته بدون کدنویسی همراه با سئو و بهینه‌سازی سرعت",
          duration: "۱۲ هفته",
          price: 4500000,
          img: "/assets/StatCard/blue.png",
          spotplayerCourseId: "650000000000000000000001",
        },
        {
          title: "دوره جامع سئو و بهینه‌سازی موتورهای جستجو",
          category: "فناوری اطلاعات",
          tags: ["سئو", "آنالیتیکس", "گوگل"],
          description: "تکنیک‌های جذب ترافیک ارگانیک، سئو تکنیکال و رتبه‌گیری در صفحه اول گوگل",
          duration: "۸ هفته",
          price: 3800000,
          img: "/assets/StatCard/green.png",
          spotplayerCourseId: "650000000000000000000002",
        },
      ]);
      console.log("✅ Sample Virtual courses seeded.");
    }

    // 3. مقالات وبلاگ
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.create([
        {
          title: "چطور یادگیری برنامه‌نویسی را شروع کنیم و در مسیر ناامید نشویم؟",
          slug: "how-to-start-coding-and-stay-motivated",
          category: "فرانتاند",
          description: "راهنمای گام به گام انتخاب مسیر، دوری از تله آموزشی و ورود سریع به بازار کار",
          content: "<p>شروع مسیر یادگیری برنامه‌نویسی نیازمند نقشه راه شفاف و تمرین پروژه‌محور است...</p>",
          img: "/assets/Blogs/1.png",
          readTime: "۷ دقیقه",
        },
        {
          title: "چرا یادگیری پروژه‌محور مسیر شغلی را تا ۳ برابر کوتاه‌تر می‌کند؟",
          slug: "why-project-based-learning-speeds-up-career",
          category: "مسیر شغلی",
          description: "بررسی تفاوت دوره‌های تئوری و کارگاهی در تسلط بر مهارت‌های واقعی",
          content: "<p>در کالج رکاد تمرکز اصلی روی حل مسائل دنیای واقعی و ساخت پورتفولیو است...</p>",
          img: "/assets/Blogs/2.png",
          readTime: "۵ دقیقه",
        },
      ]);
      console.log("✅ Sample Blog articles seeded.");
    }

    console.log("🎉 All sample data ready!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedData();
