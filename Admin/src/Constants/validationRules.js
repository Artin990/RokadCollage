/**
 * Canonical regular expression patterns and validation constants.
 * Synchronized with RokadCollage API Joi validations.
 */

// Matches Persian, English letters, digits (English & Persian), and full standard punctuation & symbols
export const safeTextRegex = /^[\u0600-\u06FF\u0750-\u077F\sA-Za-z0-9\u06F0-\u06F9\u0660-\u0669\-\_،؛؟!.:«»",;?()\/\\+&#%@|*~=^!\[\]{}'"`—–…\u200c\u200d\u00A0\r\n\t<>$€£°]+$/;

// Matches Persian or English date formats (YYYY/MM/DD or YYYY-MM-DD)
export const birthDateRegex = /^[\d\u06F0-\u06F9]{4}[\/\-][\d\u06F0-\u06F9]{1,2}[\/\-][\d\u06F0-\u06F9]{1,2}$/;

/**
 * Converts Persian and Arabic digits to English digits.
 * @param {string} str
 * @returns {string}
 */
export const normalizePersianDigits = (str) => {
  if (!str || typeof str !== "string") return str || "";
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
};

/**
 * Normalizes birthDate into canonical standard format (YYYY/MM/DD).
 * @param {string} str
 * @returns {string}
 */
export const normalizeBirthDate = (str) => {
  if (!str || typeof str !== "string") return "";
  const cleaned = normalizePersianDigits(str.trim());
  const parts = cleaned.split(/[\/\-]/);
  if (parts.length === 3) {
    const year = parts[0].padStart(4, "0");
    const month = parts[1].padStart(2, "0");
    const day = parts[2].padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  return cleaned;
};

// Matches Iranian mobile numbers (09... or +989... with English or Persian digits)
export const phoneRegex = /^(\+98|\+۹۸|0|۰)?(9|۹)[\d\u06F0-\u06F9\u0660-\u0669]{9}$/;

// Matches 24-character hexadecimal MongoDB ObjectIds
export const hex24Regex = /^[0-9a-fA-F]{24}$/;
export const objectIdRegex = hex24Regex;

// Academic Course Categories
export const courseCategories = ["فناوری اطلاعات", "گرافیک", "زبان", "MBA", "مشاوره"];

export const courseCategoryOptions = [
  { value: "فناوری اطلاعات", label: "فناوری اطلاعات" },
  { value: "گرافیک", label: "گرافیک" },
  { value: "زبان", label: "زبان" },
  { value: "MBA", label: "MBA" },
  { value: "مشاوره", label: "مشاوره" },
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
