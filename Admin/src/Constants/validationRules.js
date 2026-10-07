/**
 * Canonical regular expression patterns and validation constants.
 * Synchronized with RokadCollage API Joi validations.
 */

// Matches Persian, English letters, digits, and standard punctuation
export const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;

// Matches Iranian mobile numbers (09... or +989...)
export const phoneRegex = /^(\+98|0)?9\d{9}$/;

// Matches 24-character hexadecimal MongoDB ObjectIds
export const hex24Regex = /^[0-9a-fA-F]{24}$/;
export const objectIdRegex = hex24Regex;

// Academic Course Categories
export const courseCategories = ["فناوری اطلاعات", "گرافیک", "زبان", "MBA"];

export const courseCategoryOptions = [
  { value: "فناوری اطلاعات", label: "فناوری اطلاعات" },
  { value: "گرافیک", label: "گرافیک" },
  { value: "زبان", label: "زبان" },
  { value: "MBA", label: "MBA" },
];

// Blog Categories
export const blogCategories = ["گرافیک", "مسیر شغلی", "MBA", "زبان", "فرانتاند", "بکاند"];

export const blogCategoryOptions = [
  { label: "گرافیک", value: "گرافیک" },
  { label: "مسیر شغلی", value: "مسیر شغلی" },
  { label: "MBA", value: "MBA" },
  { label: "زبان", value: "زبان" },
  { label: "فرانتاند", value: "فرانتاند" },
  { label: "بکاند", value: "بکاند" },
];

// User Roles
export const userRoles = ["user", "admin", "superAdmin"];

export const userRoleOptions = [
  { value: "user", label: "دانش‌آموز / کاربر عادی" },
  { value: "admin", label: "مدیر آموزشگاه" },
  { value: "superAdmin", label: "مدیر ارشد" },
];
