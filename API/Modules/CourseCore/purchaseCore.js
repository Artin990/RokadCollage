import mongoose from "mongoose";
import { HandleERROR } from "vanta-api";
import Enrollment from "../Enrollment/EnrollmentMd.js";
import Wallet from "../Wallet/WalletMd.js";
import Transaction from "../Wallet/TransactionMd.js";
import InPersonCourse from "../InPersonCourse/InPersonCourseMd.js";
import VirtualCourse from "../VirtualCourse/VirtualCourseMd.js";
import CourseSession from "../InPersonCourse/CourseSession/CourseSessionMd.js";
import { calculateCoursePrice } from "../../Utils/discountHelper.js";
import { issueEnrollmentLicense } from "../../Utils/spotplayer.js";

const MONGO_DUPLICATE_KEY_ERROR = 11000;

export const isTransactionSupported = () => {
    const topologyType = mongoose.connection.client?.topology?.description?.type;
    return topologyType === "ReplicaSetWithPrimary" || topologyType === "Sharded";
};

/**
 * Unified, atomic, concurrency-safe purchase service for both InPerson and Virtual courses.
 *
 * @param {Object} params
 * @param {string} params.userId - Authenticated user ID
 * @param {string} params.courseId - ID of the course being purchased
 * @param {"InPersonCourse"|"VirtualCourse"} [params.courseModel] - Course model type (auto-detected if omitted)
 * @param {string} [params.sessionId] - Session ID (required for InPersonCourse)
 * @param {string} [params.couponCode] - Optional discount coupon code
 * @returns {Promise<Object>} Populated enrollment, walletBalance, transactionId, pricingBreakdown
 */
export async function purchaseCourseService({
    userId,
    courseId,
    courseModel = null,
    sessionId = null,
    couponCode = null,
}) {
    // 1. Identify and load the course
    let course = null;
    let modelName = courseModel;

    if (modelName === "InPersonCourse") {
        course = await InPersonCourse.findById(courseId);
        if (!course) {
            throw new HandleERROR("دوره حضوری مورد نظر یافت نشد", 404);
        }
    } else if (modelName === "VirtualCourse") {
        course = await VirtualCourse.findById(courseId);
        if (!course) {
            throw new HandleERROR("دوره مجازی مورد نظر یافت نشد", 404);
        }
    } else {
        // Auto-detect course model
        course = await InPersonCourse.findById(courseId);
        if (course) {
            modelName = "InPersonCourse";
        } else {
            course = await VirtualCourse.findById(courseId);
            if (course) {
                modelName = "VirtualCourse";
            } else {
                throw new HandleERROR("دوره مورد نظر یافت نشد", 404);
            }
        }
    }

    // 2. Validate InPerson session requirements
    let targetSession = null;
    if (modelName === "InPersonCourse") {
        if (!sessionId) {
            throw new HandleERROR("انتخاب کد کلاس برای دوره‌های حضوری الزامی است", 400);
        }

        targetSession = await CourseSession.findById(sessionId);
        if (!targetSession) {
            throw new HandleERROR("کد کلاس مورد نظر یافت نشد", 404);
        }

        if (targetSession.course.toString() !== course._id.toString()) {
            throw new HandleERROR("کد کلاس انتخاب‌شده متعلق به این دوره نیست", 400);
        }

        if (
            targetSession.capacity != null &&
            targetSession.capacity > 0 &&
            (targetSession.enrolledCount || 0) >= targetSession.capacity
        ) {
            throw new HandleERROR("ظرفیت این کد کلاس تکمیل شده است", 400);
        }
    }

    // 3. Verify no existing enrollment
    const existingEnrollment = await Enrollment.findOne({
        user: userId,
        course: course._id,
    });
    if (existingEnrollment) {
        throw new HandleERROR("شما قبلاً در این دوره ثبت‌نام کرده‌اید", 400);
    }

    // 4. Calculate dynamic pricing
    const priceResult = calculateCoursePrice(course, couponCode);
    if (!priceResult.success) {
        throw new HandleERROR(priceResult.error, 400);
    }

    const {
        basePrice,
        discountAmount,
        finalPrice,
        discountType,
        discountPercentage,
        couponCode: appliedCouponCode,
        couponTitle,
    } = priceResult;

    // 5. Verify user wallet
    let wallet = await Wallet.findOne({ ownerId: userId });
    if (!wallet) {
        wallet = await Wallet.create({ ownerId: userId, balance: 0 });
    }

    if (wallet.balance < finalPrice) {
        throw new HandleERROR(
            `موجودی کیف پول شما کافی نیست. مبلغ مورد نیاز: ${finalPrice.toLocaleString("fa-IR")} تومان، موجودی فعلی: ${wallet.balance.toLocaleString("fa-IR")} تومان`,
            400
        );
    }

    // 6. Concurrency-safe atomic execution
    const supportsNativeTx = isTransactionSupported();
    const mongoSession = supportsNativeTx ? await mongoose.startSession() : null;
    if (mongoSession) {
        mongoSession.startTransaction();
    }

    const txOptions = mongoSession ? { session: mongoSession } : {};
    let capacityIncremented = false;
    let walletDeducted = false;
    let transactionRecordId = null;
    let createdEnrollment = null;

    try {
        // Step A: In-person session seat reservation (atomic condition check)
        if (modelName === "InPersonCourse" && targetSession) {
            const sessionQuery = { _id: sessionId };
            if (targetSession.capacity != null && targetSession.capacity > 0) {
                sessionQuery.enrolledCount = { $lt: targetSession.capacity };
            }

            const updatedSession = await CourseSession.findOneAndUpdate(
                sessionQuery,
                { $inc: { enrolledCount: 1 } },
                { ...txOptions, new: true }
            );

            if (!updatedSession) {
                throw new HandleERROR("متأسفانه ظرفیت این کد کلاس تکمیل شده است", 400);
            }
            capacityIncremented = true;
        }

        // Step B: Wallet balance atomic deduction
        const updatedWallet = await Wallet.findOneAndUpdate(
            {
                ownerId: userId,
                balance: { $gte: finalPrice },
            },
            { $inc: { balance: -finalPrice } },
            { ...txOptions, new: true }
        );

        if (!updatedWallet) {
            if (!mongoSession && capacityIncremented) {
                await CourseSession.findByIdAndUpdate(sessionId, {
                    $inc: { enrolledCount: -1 },
                }).catch(() => {});
            }
            throw new HandleERROR("موجودی کیف پول شما کافی نمی‌باشد", 400);
        }
        walletDeducted = true;

        // Step C: Create transaction record
        const transactionDescription = `خرید دوره «${course.title}»${targetSession ? ` - ${targetSession.code}` : ""}${
            discountAmount > 0 ? ` با تخفیف ${discountAmount.toLocaleString("fa-IR")} تومان` : ""
        }`;

        const [transaction] = await Transaction.create(
            [
                {
                    walletId: wallet._id,
                    userId,
                    type: "purchase",
                    amount: finalPrice,
                    status: "success",
                    description: transactionDescription,
                },
            ],
            txOptions
        );
        transactionRecordId = transaction._id;

        // Step D: Create enrollment record
        const enrollmentPayload = {
            user: userId,
            course: course._id,
            courseModel: modelName,
            session: targetSession ? targetSession._id : null,
            pricePaid: finalPrice,
            discountAmount,
            couponCode: appliedCouponCode || "",
            transactionId: transaction._id,
        };

        if (modelName === "VirtualCourse") {
            enrollmentPayload.spotplayer = {
                status: "pending",
            };
        }

        const [enrollment] = await Enrollment.create([enrollmentPayload], txOptions);
        createdEnrollment = enrollment;

        // Commit transaction if using native replica set session
        if (mongoSession) {
            await mongoSession.commitTransaction();
            mongoSession.endSession();
        }

        // Step E: Post-commit tasks (executed outside MongoDB transaction)
        if (modelName === "VirtualCourse" && createdEnrollment) {
            try {
                await issueEnrollmentLicense(createdEnrollment._id);
            } catch (err) {
                console.error("SpotPlayer license issue error on purchase:", err?.message || err);
            }
        }

        const populatedEnrollment = await Enrollment.findById(createdEnrollment._id)
            .populate("course", "title type category price img duration spotplayerCourseId")
            .populate("session", "code scheduleDays scheduleHours capacity enrolledCount");

        return {
            enrollment: populatedEnrollment,
            walletBalance: updatedWallet.balance,
            transactionId: transaction._id,
            pricingBreakdown: {
                basePrice,
                discountAmount,
                finalPrice,
                discountType,
                discountPercentage,
                couponTitle: couponTitle || null,
            },
        };
    } catch (error) {
        if (mongoSession) {
            await mongoSession.abortTransaction();
            mongoSession.endSession();
        } else {
            // Compensating rollbacks for standalone MongoDB
            if (walletDeducted) {
                await Wallet.findOneAndUpdate(
                    { ownerId: userId },
                    { $inc: { balance: finalPrice } }
                ).catch(() => {});
            }
            if (capacityIncremented && sessionId) {
                await CourseSession.findByIdAndUpdate(sessionId, {
                    $inc: { enrolledCount: -1 },
                }).catch(() => {});
            }
            if (transactionRecordId) {
                await Transaction.findByIdAndDelete(transactionRecordId).catch(() => {});
            }
        }

        if (error.code === MONGO_DUPLICATE_KEY_ERROR) {
            throw new HandleERROR("شما قبلاً در این دوره ثبت‌نام کرده‌اید", 400);
        }
        throw error;
    }
}

// Backward-compatible alias
export const executeCoursePurchase = purchaseCourseService;
