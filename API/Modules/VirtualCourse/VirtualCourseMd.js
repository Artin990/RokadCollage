import mongoose from "mongoose";
import { createCourseSchema } from "../CourseCore/courseBase.js";

const virtualSpecificFields = {
    spotplayerCourseId: {
        type: String,
        required: [true, "شناسه دوره در اسپات‌پلییر الزامی است"],
        trim: true,
        match: [/^[0-9a-fA-F]{24}$/, "شناسه دوره در اسپات‌پلییر باید یک رشته هگز ۲۴ کاراکتری باشد"],
    },
};

const virtualCourseSchema = createCourseSchema(virtualSpecificFields, "مجازی");

virtualCourseSchema.index({ teachers: 1 });
virtualCourseSchema.index({ spotplayerCourseId: 1 });

const VirtualCourse = mongoose.model("VirtualCourse", virtualCourseSchema);
export default VirtualCourse;
