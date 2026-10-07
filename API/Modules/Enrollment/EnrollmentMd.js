import mongoose from "mongoose";
import "../InPersonCourse/InPersonCourseMd.js";
import "../VirtualCourse/VirtualCourseMd.js";

const spotplayerSchema = new mongoose.Schema(
  {
    licenseId: {
      type: String,
      trim: true,
      default: null,
    },
    key: {
      type: String,
      trim: true,
      select: false,
    },
    url: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "issued", "failed"],
      default: "pending",
    },
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه کاربر الزامی است"],
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "courseModel",
      required: [true, "شناسه دوره الزامی است"],
      index: true,
    },
    courseModel: {
      type: String,
      required: [true, "نوع مدل دوره الزامی است"],
      enum: ["InPersonCourse", "VirtualCourse"],
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseSession",
      default: null,
      index: true,
    },
    pricePaid: {
      type: Number,
      required: [true, "مبلغ پرداختی الزامی است"],
      min: [0, "مبلغ پرداختی نمی‌تواند منفی باشد"],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, "مبلغ تخفیف نمی‌تواند منفی باشد"],
    },
    couponCode: {
      type: String,
      trim: true,
      default: "",
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
    spotplayer: {
      type: spotplayerSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollment for the same user and course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1, createdAt: -1 });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
