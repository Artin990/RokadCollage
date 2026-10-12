import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import InPersonCourse from "./InPersonCourseMd.js";
import CourseSession from "./CourseSession/CourseSessionMd.js";
import Comment from "../Comment/CommentMd.js";
import { purchaseCourseService } from "../CourseCore/purchaseCore.js";
import { attachSessionCapacity } from "../../Utils/sessionHelper.js";
import { attachDynamicPricing } from "../../Utils/discountHelper.js";
import { removePublicFile } from "../../Utils/fileHelper.js";

/**
 * Extracts src URL from iframe embed codes if present, or returns trimmed input.
 */
export const sanitizeEmbedUrl = (input) => {
    if (!input || typeof input !== "string") return "";
    const trimmed = input.trim();
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : trimmed;
};

/**
 * Sanitizes embed URLs inside an in-person course location object.
 */
export const sanitizeLocationUrls = (location) => {
    if (!location || typeof location !== "object") return location;
    const sanitized = { ...location };
    const embedFields = ["googleMapEmbedUrl", "neshanEmbedUrl", "baladEmbedUrl", "mapEmbedUrl"];
    for (const field of embedFields) {
        if (sanitized[field]) {
            sanitized[field] = sanitizeEmbedUrl(sanitized[field]);
        }
    }
    return sanitized;
};

/**
 * Loads course sessions and calculates remaining capacity.
 */
export const loadCourseSessions = async (courseId) => {
    const sessions = await CourseSession.find({ course: courseId })
        .sort({ createdAt: 1 })
        .lean();
    return attachSessionCapacity(sessions);
};

/**
 * List in-person courses with search, filters, pagination, and dynamic pricing.
 * GET /in-person-courses
 */
export const getAll = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(InPersonCourse, req.query, req.role)
        .search(["title", "description", "category", "duration", "tags"])
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .populate("teachers");

    const result = await features.execute();
    const withCapacity = attachSessionCapacity(result);

    if (Array.isArray(withCapacity)) {
        return res.status(200).json(attachDynamicPricing(withCapacity));
    } else if (withCapacity?.data && Array.isArray(withCapacity.data)) {
        withCapacity.data = attachDynamicPricing(withCapacity.data);
        return res.status(200).json(withCapacity);
    }

    return res.status(200).json(result);
});

/**
 * Fetch a single in-person course by ID including teachers, pricing, and sessions.
 * GET /in-person-courses/:id
 */
export const getOne = catchAsync(async (req, res, next) => {
    const course = await InPersonCourse.findById(req.params.id).populate("teachers");
    if (!course) {
        return next(new HandleERROR("دوره حضوری مورد نظر یافت نشد", 404));
    }

    const enriched = attachDynamicPricing(course);
    enriched.sessions = await loadCourseSessions(course._id);

    return res.status(200).json({
        success: true,
        data: enriched,
    });
});

/**
 * Create a new in-person course and optionally create initial sessions.
 * POST /in-person-courses
 */
export const create = catchAsync(async (req, res, next) => {
    const payload = { ...req.body };

    if (payload.location) {
        payload.location = sanitizeLocationUrls(payload.location);
    }

    // Extract initial sessions to save separately in CourseSession collection
    const initialSessions = Array.isArray(payload.sessions) ? payload.sessions : [];
    delete payload.sessions;

    const newCourse = await InPersonCourse.create(payload);

    let createdSessions = [];
    if (initialSessions.length > 0) {
        const sessionDocs = initialSessions.map((sess) => ({
            course: newCourse._id,
            code: sess.code.trim(),
            scheduleDays: sess.scheduleDays.trim(),
            scheduleHours: sess.scheduleHours.trim(),
            capacity: Number(sess.capacity),
            enrolledCount: 0,
        }));
        createdSessions = await CourseSession.insertMany(sessionDocs);
    }

    const responseData = attachDynamicPricing(newCourse);
    responseData.sessions = attachSessionCapacity(createdSessions);

    return res.status(201).json({
        success: true,
        message: "دوره حضوری با موفقیت ایجاد شد",
        data: responseData,
    });
});

/**
 * Update an existing in-person course.
 * PATCH /in-person-courses/:id
 */
export const update = catchAsync(async (req, res, next) => {
    const allowedUpdates = [
        "category",
        "tags",
        "title",
        "description",
        "duration",
        "img",
        "price",
        "timedDiscount",
        "discountCodes",
        "sprints",
        "teachers",
        "location",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }

    if (updates.location) {
        updates.location = sanitizeLocationUrls(updates.location);
    }

    const oldCourse = await InPersonCourse.findById(req.params.id);
    if (!oldCourse) {
        return next(new HandleERROR("دوره حضوری مورد نظر یافت نشد", 404));
    }

    if (updates.img && updates.img !== oldCourse.img) {
        removePublicFile(oldCourse.img);
    }

    const updatedCourse = await InPersonCourse.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    }).populate("teachers");

    const responseData = attachDynamicPricing(updatedCourse);
    responseData.sessions = await loadCourseSessions(updatedCourse._id);

    return res.status(200).json({
        success: true,
        message: "دوره حضوری با موفقیت بروزرسانی شد",
        data: responseData,
    });
});

/**
 * Remove an in-person course and cascade delete its sessions.
 * DELETE /in-person-courses/:id
 */
export const remove = catchAsync(async (req, res, next) => {
    const deletedCourse = await InPersonCourse.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
        return next(new HandleERROR("دوره حضوری مورد نظر یافت نشد", 404));
    }

    if (deletedCourse.img) {
        removePublicFile(deletedCourse.img);
    }

    // Cascade delete related sessions and testimonials
    await Promise.all([
        CourseSession.deleteMany({ course: deletedCourse._id }),
        Comment.deleteMany({ course: deletedCourse._id }),
    ]);

    return res.status(200).json({
        success: true,
        message: "دوره حضوری با موفقیت حذف شد",
        data: null,
    });
});

/**
 * Toggle active state of a discount code within an in-person course.
 * PATCH /in-person-courses/:courseId/discount-codes/:codeId/toggle
 */
export const toggleDiscountCode = catchAsync(async (req, res, next) => {
    const { courseId, codeId } = req.params;
    const course = await InPersonCourse.findById(courseId);
    if (!course) {
        return next(new HandleERROR("دوره مورد نظر یافت نشد", 404));
    }

    const discountItem = course.discountCodes?.id(codeId);
    if (!discountItem) {
        return next(new HandleERROR("کد تخفیف مورد نظر یافت نشد", 404));
    }

    discountItem.isActive = !discountItem.isActive;
    await course.save();

    return res.status(200).json({
        success: true,
        message: "وضعیت کد تخفیف با موفقیت تغییر کرد",
        data: course,
    });
});

/**
 * Purchase an in-person course with atomic seat reservation and wallet deduction.
 * POST /in-person-courses/:id/purchase
 */
export const purchaseInPersonCourse = catchAsync(async (req, res, next) => {
    const courseId = req.params.id;
    const { sessionId, couponCode } = req.body;
    const userId = req.userId;

    const result = await purchaseCourseService({
        userId,
        courseId,
        courseModel: "InPersonCourse",
        sessionId,
        couponCode,
    });

    return res.status(201).json({
        success: true,
        message: "خرید و ثبت‌نام در دوره حضوری با موفقیت انجام شد",
        data: result,
    });
});
