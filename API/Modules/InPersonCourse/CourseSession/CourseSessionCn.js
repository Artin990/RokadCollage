import mongoose from "mongoose";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import CourseSession from "./CourseSessionMd.js";
import InPersonCourse from "../InPersonCourseMd.js";
import Enrollment from "../../Enrollment/EnrollmentMd.js";
import { attachSessionCapacity } from "../../../Utils/sessionHelper.js";

/**
 * Fetch all sessions for a specific in-person course with computed capacity.
 * GET /in-person-courses/:courseId/sessions
 */
export const getSessionsByCourse = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;

    const course = await InPersonCourse.findById(courseId);
    if (!course) {
        return next(new HandleERROR("دوره حضوری مورد نظر یافت نشد", 404));
    }

    const queryCopy = { ...req.query };
    if (!queryCopy.sort) {
        queryCopy.sort = "createdAt";
    }

    const features = new ApiFeatures(CourseSession, queryCopy, req.role)
        .addManualFilters({ course: new mongoose.Types.ObjectId(courseId) })
        .filter()
        .sort()
        .limitFields();

    const result = await features.execute();
    const rawSessions = Array.isArray(result) ? result : result?.data ? result.data : [];
    const enrichedSessions = attachSessionCapacity(rawSessions);

    return res.status(200).json({
        success: true,
        count: enrichedSessions.length,
        data: enrichedSessions,
    });
});

/**
 * Add a new session code to an in-person course.
 * POST /in-person-courses/:courseId/sessions
 */
export const createSession = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;
    const { code, scheduleDays, scheduleHours, capacity } = req.body;

    const course = await InPersonCourse.findById(courseId);
    if (!course) {
        return next(new HandleERROR("دوره حضوری مورد نظر یافت نشد", 404));
    }

    const trimmedCode = code.trim();

    // Check code uniqueness within this course
    const existingSession = await CourseSession.findOne({
        course: courseId,
        code: trimmedCode,
    });

    if (existingSession) {
        return next(
            new HandleERROR(`کد کلاس «${trimmedCode}» قبلاً برای این دوره ثبت شده است`, 400)
        );
    }

    const newSession = await CourseSession.create({
        course: courseId,
        code: trimmedCode,
        scheduleDays: scheduleDays.trim(),
        scheduleHours: scheduleHours.trim(),
        capacity: Number(capacity),
        enrolledCount: 0,
    });

    const enrichedSession = attachSessionCapacity(newSession);

    return res.status(201).json({
        success: true,
        message: "کد کلاس جدید با موفقیت ایجاد شد",
        data: enrichedSession,
    });
});

/**
 * Update an existing session code.
 * PATCH /in-person-courses/:courseId/sessions/:sessionId
 */
export const updateSession = catchAsync(async (req, res, next) => {
    const { courseId, sessionId } = req.params;
    const { code, scheduleDays, scheduleHours, capacity } = req.body;

    const session = await CourseSession.findOne({
        _id: sessionId,
        course: courseId,
    });

    if (!session) {
        return next(new HandleERROR("کد کلاس مورد نظر یافت نشد", 404));
    }

    const updates = {};

    if (code !== undefined) {
        const trimmedCode = code.trim();
        if (trimmedCode !== session.code) {
            const duplicate = await CourseSession.findOne({
                course: courseId,
                code: trimmedCode,
                _id: { $ne: sessionId },
            });
            if (duplicate) {
                return next(
                    new HandleERROR(`کد کلاس «${trimmedCode}» برای این دوره تکراری است`, 400)
                );
            }
            updates.code = trimmedCode;
        }
    }

    if (scheduleDays !== undefined) {
        updates.scheduleDays = scheduleDays.trim();
    }

    if (scheduleHours !== undefined) {
        updates.scheduleHours = scheduleHours.trim();
    }

    if (capacity !== undefined) {
        updates.capacity = Number(capacity);
    }

    const updatedSession = await CourseSession.findByIdAndUpdate(
        sessionId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    const enrichedSession = attachSessionCapacity(updatedSession);

    return res.status(200).json({
        success: true,
        message: "کد کلاس با موفقیت بروزرسانی شد",
        data: enrichedSession,
    });
});

/**
 * Delete a session code from a course.
 * DELETE /in-person-courses/:courseId/sessions/:sessionId
 */
export const deleteSession = catchAsync(async (req, res, next) => {
    const { courseId, sessionId } = req.params;

    const session = await CourseSession.findOne({
        _id: sessionId,
        course: courseId,
    });

    if (!session) {
        return next(new HandleERROR("کد کلاس مورد نظر یافت نشد", 404));
    }

    // Ensure at least one session code remains for in-person courses
    const totalSessionsCount = await CourseSession.countDocuments({ course: courseId });
    if (totalSessionsCount <= 1) {
        return next(new HandleERROR("هر دوره حضوری باید حداقل یک کد کلاس داشته باشد", 400));
    }

    // Prevent deletion if students have enrolled in this session
    const enrollmentCount = await Enrollment.countDocuments({ session: sessionId });
    if (enrollmentCount > 0) {
        return next(
            new HandleERROR(
                `امکان حذف این کد کلاس وجود ندارد زیرا ${enrollmentCount} کاربر در آن ثبت‌نام کرده‌اند`,
                400
            )
        );
    }

    await CourseSession.findByIdAndDelete(sessionId);

    return res.status(200).json({
        success: true,
        message: "کد کلاس با موفقیت حذف شد",
        data: null,
    });
});
