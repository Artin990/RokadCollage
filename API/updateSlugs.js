import mongoose from "mongoose";
import InPersonCourse from "./Modules/InPersonCourse/InPersonCourseMd.js";

async function updateSlugs() {
  const mongoUri =
    process.env.DATA_BASE || "mongodb://127.0.0.1:27017/RokadCollage?directConnection=true";
  await mongoose.connect(mongoUri);

  const slugMap = [
    { title: "ICDL و سواد دیجیتال", slug: "icdl" },
    { title: "فتوشاپ", slug: "photoshop" },
    { title: "پریمیر", slug: "premiere" },
    { title: "افترافکت", slug: "after-effects" },
    { title: "طراحی سایت با وردپرس", slug: "wordpress" },
    { title: "طراحی رابط و تجربه کاربری (UI/UX)", slug: "ui-ux" },
    { title: "برنامه‌نویسی فرانت‌اند", slug: "frontend" },
    { title: "برنامه‌نویسی بک‌اند", slug: "backend" },
    { title: "ابزارهای هوش مصنوعی و تولید محتوا", slug: "ai" },
  ];

  for (const item of slugMap) {
    const res = await InPersonCourse.updateOne(
      { title: item.title },
      { $set: { slug: item.slug } }
    );
    console.log(`Updated slug for "${item.title}" -> "${item.slug}" (matched: ${res.matchedCount})`);
  }

  const all = await InPersonCourse.find({}, "title slug");
  console.log("All courses with slugs:", all);

  await mongoose.disconnect();
}

updateSlugs().catch((err) => {
  console.error("Slug update error:", err);
  process.exit(1);
});
