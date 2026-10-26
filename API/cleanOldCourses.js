import mongoose from "mongoose";
import InPersonCourse from "./Modules/InPersonCourse/InPersonCourseMd.js";
import CourseSession from "./Modules/InPersonCourse/CourseSession/CourseSessionMd.js";

async function clean() {
  const mongoUri =
    process.env.DATA_BASE || "mongodb://127.0.0.1:27017/RokadCollage?directConnection=true";
  await mongoose.connect(mongoUri);

  const validTitles = [
    "ICDL و سواد دیجیتال",
    "فتوشاپ",
    "پریمیر",
    "افترافکت",
    "طراحی سایت با وردپرس",
    "طراحی رابط و تجربه کاربری (UI/UX)",
    "برنامه‌نویسی فرانت‌اند",
    "برنامه‌نویسی بک‌اند",
    "ابزارهای هوش مصنوعی و تولید محتوا",
  ];

  const toDelete = await InPersonCourse.find({ title: { $nin: validTitles } });
  console.log(
    "Found courses to delete:",
    toDelete.map((c) => ({ id: c._id.toString(), title: c.title }))
  );

  const toDeleteIds = toDelete.map((c) => c._id);

  const deletedCourses = await InPersonCourse.deleteMany({ _id: { $in: toDeleteIds } });
  const deletedSessions = await CourseSession.deleteMany({ course: { $in: toDeleteIds } });

  console.log("Deleted courses count:", deletedCourses.deletedCount);
  console.log("Deleted associated sessions count:", deletedSessions.deletedCount);

  const remaining = await InPersonCourse.find({}, "title");
  console.log("Remaining in-person courses count:", remaining.length);
  console.log(
    "Remaining titles:",
    remaining.map((r) => r.title)
  );

  await mongoose.disconnect();
}

clean().catch((err) => {
  console.error("Clean error:", err);
  process.exit(1);
});
