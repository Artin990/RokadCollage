/**
 * Discount and Pricing Helper Utilities
 */

export function isDateWithinRange(date, startDate, endDate) {
  const current = new Date(date).getTime();
  if (startDate && new Date(startDate).getTime() > current) return false;
  if (endDate && new Date(endDate).getTime() < current) return false;
  return true;
}

export function computeTimedDiscount(course, now = new Date()) {
  if (
    course.timedDiscount &&
    course.timedDiscount.percentage > 0 &&
    isDateWithinRange(now, course.timedDiscount.startDate, course.timedDiscount.endDate)
  ) {
    return {
      isActive: true,
      percentage: Number(course.timedDiscount.percentage),
      startDate: course.timedDiscount.startDate,
      endDate: course.timedDiscount.endDate,
    };
  }
  return { isActive: false, percentage: 0 };
}

export function validateCoupon(course, couponCode, now = new Date()) {
  if (
    !couponCode ||
    !course.discountCodes ||
    !Array.isArray(course.discountCodes) ||
    course.discountCodes.length === 0
  ) {
    return { isValid: false, message: "کد تخفیف وارد شده معتبر نمی‌باشد" };
  }

  const normalizedInput = couponCode.trim().toUpperCase();

  // Search discount code with case-insensitive match
  const matched = course.discountCodes.find(
    (item) => item.code && item.code.trim().toUpperCase() === normalizedInput
  );

  // If code is not found, inactive, or outside valid date range, return generic invalid message
  if (
    !matched ||
    matched.isActive === false ||
    !isDateWithinRange(now, matched.startDate, matched.endDate)
  ) {
    return { isValid: false, message: "کد تخفیف وارد شده معتبر نمی‌باشد" };
  }

  return {
    isValid: true,
    percentage: Number(matched.percentage) || 0,
    code: matched.code.trim().toUpperCase(),
    title: matched.title || "",
    _id: matched._id,
  };
}

export function calculateCoursePrice(course, couponCode = null, now = new Date()) {
  const basePrice = Number(course.price) || 0;
  if (basePrice === 0) {
    return {
      success: true,
      basePrice: 0,
      discountAmount: 0,
      finalPrice: 0,
      discountType: "none",
      discountPercentage: 0,
    };
  }

  if (couponCode) {
    const couponValidation = validateCoupon(course, couponCode, now);
    if (!couponValidation.isValid) {
      return { success: false, error: couponValidation.message };
    }
    const discountAmount = Math.round((basePrice * couponValidation.percentage) / 100);
    return {
      success: true,
      basePrice,
      discountAmount,
      finalPrice: Math.max(0, basePrice - discountAmount),
      discountType: "coupon",
      discountPercentage: couponValidation.percentage,
      couponCode: couponValidation.code,
      couponTitle: couponValidation.title,
    };
  }

  const timedDiscount = computeTimedDiscount(course, now);
  if (timedDiscount.isActive) {
    const discountAmount = Math.round((basePrice * timedDiscount.percentage) / 100);
    return {
      success: true,
      basePrice,
      discountAmount,
      finalPrice: Math.max(0, basePrice - discountAmount),
      discountType: "timed",
      discountPercentage: timedDiscount.percentage,
    };
  }

  return {
    success: true,
    basePrice,
    discountAmount: 0,
    finalPrice: basePrice,
    discountType: "none",
    discountPercentage: 0,
  };
}

export function attachDynamicPricing(courses, now = new Date()) {
  if (!courses) return courses;

  const enrichOne = (item) => {
    if (!item) return item;
    const raw = typeof item.toObject === "function" ? item.toObject() : { ...item };
    const timed = computeTimedDiscount(raw, now);
    const basePrice = Number(raw.price) || 0;

    if (timed.isActive) {
      const discountAmount = Math.round((basePrice * timed.percentage) / 100);
      raw.finalPrice = Math.max(0, basePrice - discountAmount);
      raw.isDiscountActive = true;
      raw.activeDiscountPercentage = timed.percentage;
      raw.activeDiscountType = "timed";
    } else {
      raw.finalPrice = basePrice;
      raw.isDiscountActive = false;
      raw.activeDiscountPercentage = 0;
      raw.activeDiscountType = "none";
    }

    return raw;
  };

  if (Array.isArray(courses)) {
    return courses.map(enrichOne);
  }

  return enrichOne(courses);
}
