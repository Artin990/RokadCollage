import mongoose from "mongoose";
import "../InPersonCourse/InPersonCourseMd.js";
import "../VirtualCourse/VirtualCourseMd.js";

const commentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "courseModel",
      required: [true, "انتخاب دوره مرتبط الزامی است"],
    },
    courseModel: {
      type: String,
      required: [true, "نوع مدل دوره الزامی است"],
      enum: ["InPersonCourse", "VirtualCourse"],
      default: "InPersonCourse",
    },
    comment: {
      type: String,
      required: [true, "وارد کردن متن نظر الزامی است"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "وارد کردن نام نویسنده الزامی است"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "وارد کردن نقش فرد کامنت‌گذار الزامی است"],
      trim: true,
    },
    job: {
      type: String,
      trim: true,
      default: "",
    },
    img: {
      type: String,
      default: "default-BoyStudent.png",
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ course: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
