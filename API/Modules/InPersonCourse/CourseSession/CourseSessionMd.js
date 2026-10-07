import mongoose from "mongoose";

const courseSessionSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InPersonCourse",
            required: [true, "شناسه دوره الزامی است"],
            index: true,
        },
        code: {
            type: String,
            required: [true, "وارد کردن کد کلاس الزامی است"],
            trim: true,
        },
        scheduleDays: {
            type: String,
            required: [true, "وارد کردن روزهای برگزاری الزامی است"],
            trim: true,
        },
        scheduleHours: {
            type: String,
            required: [true, "وارد کردن ساعت برگزاری الزامی است"],
            trim: true,
        },
        capacity: {
            type: Number,
            required: [true, "وارد کردن ظرفیت کد کلاس الزامی است"],
            min: [1, "ظرفیت باید حداقل ۱ نفر باشد"],
        },
        enrolledCount: {
            type: Number,
            default: 0,
            min: [0, "تعداد ثبت‌نام‌شدگان نمی‌تواند عددی منفی باشد"],
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index to guarantee uniqueness of session code within the same course
courseSessionSchema.index({ course: 1, code: 1 }, { unique: true });
courseSessionSchema.index({ course: 1, createdAt: 1 });

const CourseSession = mongoose.model("CourseSession", courseSessionSchema);
export default CourseSession;
