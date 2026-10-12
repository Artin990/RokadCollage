import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import VirtualCourse from "./VirtualCourseMd.js";
import { purchaseCourseService } from "../CourseCore/purchaseCore.js";
import { attachDynamicPricing } from "../../Utils/discountHelper.js";
import { adminManualEnroll } from "../Enrollment/EnrollmentCn.js";
import CourseComment from "../CourseComment/CourseCommentMd.js";
import Comment from "../Comment/CommentMd.js";
import { removePublicFile } from "../../Utils/fileHelper.js";

/**
 * List virtual courses with search, filters, pagination, and dynamic pricing.
 * GET /virtual-courses
 */
export const getAll = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(VirtualCourse, req.query, req.role)
        .search(["title", "description", "category", "duration", "tags", "spotplayerCourseId"])
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .populate("teachers");

    const result = await features.execute();

    if (Array.isArray(result)) {
        return res.status(200).json(attachDynamicPricing(result));
    } else if (result?.data && Array.isArray(result.data)) {
        result.data = attachDynamicPricing(result.data);
        return res.status(200).json(result);
    }

    return res.status(200).json(result);
});

/**
 * Fetch a single virtual course by ID including teachers and pricing.
 * GET /virtual-courses/:id
 */
export const getOne = catchAsync(async (req, res, next) => {
    const course = await VirtualCourse.findById(req.params.id).populate("teachers");
    if (!course) {
        return next(new HandleERROR("دوره مجازی مورد نظر یافت نشد", 404));
    }

    return res.status(200).json({
        success: true,
        data: attachDynamicPricing(course),
    });
});

/**
 * Create a new virtual course.
 * POST /virtual-courses
 */
export const create = catchAsync(async (req, res, next) => {
    const newCourse = await VirtualCourse.create(req.body);

    return res.status(201).json({
        success: true,
        message: "دوره مجازی با موفقیت ایجاد شد",
        data: attachDynamicPricing(newCourse),
    });
});

/**
 * Update an existing virtual course.
 * PATCH /virtual-courses/:id
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
        "teachers",
        "sprints",
        "spotplayerCourseId",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }

    const oldCourse = await VirtualCourse.findById(req.params.id);
    if (!oldCourse) {
        return next(new HandleERROR("دوره مجازی مورد نظر یافت نشد", 404));
    }

    if (updates.img && updates.img !== oldCourse.img) {
        removePublicFile(oldCourse.img);
    }

    const updatedCourse = await VirtualCourse.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    }).populate("teachers");

    return res.status(200).json({
        success: true,
        message: "دوره مجازی با موفقیت بروزرسانی شد",
        data: attachDynamicPricing(updatedCourse),
    });
});

/**
 * Delete a virtual course.
 * DELETE /virtual-courses/:id
 */
export const remove = catchAsync(async (req, res, next) => {
    const deletedCourse = await VirtualCourse.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
        return next(new HandleERROR("دوره مجازی مورد نظر یافت نشد", 404));
    }

    if (deletedCourse.img) {
        removePublicFile(deletedCourse.img);
    }

    // Cascade delete associated comments and course discussions
    await Promise.all([
        CourseComment.deleteMany({ course: deletedCourse._id }),
        Comment.deleteMany({ course: deletedCourse._id }),
    ]);

    return res.status(200).json({
        success: true,
        message: "دوره مجازی با موفقیت حذف شد",
        data: null,
    });
});

/**
 * Toggle active state of a discount code within a virtual course.
 * PATCH /virtual-courses/:courseId/discount-codes/:codeId/toggle
 */
export const toggleDiscountCode = catchAsync(async (req, res, next) => {
    const { courseId, codeId } = req.params;
    const course = await VirtualCourse.findById(courseId);
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
 * Purchase a virtual course with atomic wallet deduction and automatic license issue.
 * POST /virtual-courses/:id/purchase
 */
export const purchaseVirtualCourse = catchAsync(async (req, res, next) => {
    const courseId = req.params.id;
    const { couponCode } = req.body;
    const userId = req.userId;

    const result = await purchaseCourseService({
        userId,
        courseId,
        courseModel: "VirtualCourse",
        couponCode,
    });

    return res.status(201).json({
        success: true,
        message: "خرید و ثبت‌نام در دوره مجازی با موفقیت انجام شد",
        data: result,
    });
});

/**
 * Manual enrollment by Admin into a virtual course.
 * Reuses the canonical adminManualEnroll implementation from Enrollment module.
 * POST /virtual-courses/:id/enrollments
 */
export const adminManualEnrollVirtual = adminManualEnroll;
