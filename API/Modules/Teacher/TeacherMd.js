import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "وارد کردن نام معلم الزامی است"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "وارد کردن تخصص معلم الزامی است"],
      trim: true,
    },
    photo: {
      type: String,
      required: [true, "آپلود تصویر معلم الزامی است"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

teacherSchema.index({ createdAt: -1 });
teacherSchema.index({ name: 1, specialization: 1 });

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
