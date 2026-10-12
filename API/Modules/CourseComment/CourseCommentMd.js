import mongoose from "mongoose";

const courseCommentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VirtualCourse",
      required: [true, "شناسه دوره مجازی الزامی است"],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه کاربر الزامی است"],
      index: true,
    },
    text: {
      type: String,
      required: [true, "متن دیدگاه الزامی است"],
      trim: true,
      minlength: [2, "متن دیدگاه باید حداقل ۲ کاراکتر باشد"],
      maxlength: [3000, "متن دیدگاه نمی‌تواند بیشتر از ۳۰۰۰ کاراکتر باشد"],
    },
    type: {
      type: String,
      enum: {
        values: ["review", "qa"],
        message: "نوع دیدگاه باید یا نظر (review) یا پرسش و پاسخ (qa) باشد",
      },
      default: "qa",
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseComment",
      default: null,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isHeartedByAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    isAdminReply: {
      type: Boolean,
      default: false,
    },
    isEnrolledStudent: {
      type: Boolean,
      default: false,
    },
    replyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual getters for like & dislike counters
courseCommentSchema.virtual("likesCount").get(function () {
  return Array.isArray(this.likes) ? this.likes.length : 0;
});

courseCommentSchema.virtual("dislikesCount").get(function () {
  return Array.isArray(this.dislikes) ? this.dislikes.length : 0;
});

courseCommentSchema.virtual("isReply").get(function () {
  return Boolean(this.parentId);
});

// Compound indexes for high performance querying
courseCommentSchema.index({ course: 1, parentId: 1, isPinned: -1, createdAt: -1 });
courseCommentSchema.index({ course: 1, type: 1, parentId: 1, createdAt: -1 });

const CourseComment = mongoose.model("CourseComment", courseCommentSchema);
export default CourseComment;
