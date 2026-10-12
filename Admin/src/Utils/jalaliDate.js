import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian.js";
import persian_fa from "react-date-object/locales/persian_fa.js";

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * Converts English digits to Persian digits.
 * @param {string|number} input
 * @returns {string}
 */
export const toPersianDigits = (input) => {
  if (input == null || input === "") return "";
  return String(input).replace(/[0-9]/g, (char) => PERSIAN_DIGITS[Number(char)]);
};


/**
 * Formats a Gregorian date (ISO string, timestamp, or Date) as a Jalali string.
 * @param {string|Date|number} dateInput
 * @param {Object} [options]
 * @param {boolean} [options.withTime=true]
 * @param {string} [options.format]
 * @returns {string}
 */
export const formatJalaliDate = (dateInput, options = {}) => {
  if (!dateInput) return "";
  try {
    const { withTime = true, format } = options;
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const dobj = new DateObject({
      date,
      calendar: persian,
      locale: persian_fa,
    });

    if (format) {
      return dobj.format(format);
    }

    return withTime
      ? dobj.format("D MMMM YYYY، ساعت HH:mm")
      : dobj.format("D MMMM YYYY");
  } catch {
    return "";
  }
};

export const toJalaliDate = (dateInput) => formatJalaliDate(dateInput, { withTime: false });
export const toJalaliDateTime = (dateInput) => formatJalaliDate(dateInput, { withTime: true });

/**
 * Formats a number as a localized Persian currency string with comma separators.
 * @param {number|string} price
 * @returns {string}
 */
export const formatPrice = (price) => {
  if (price == null || price === "") return "۰";
  const num = Number(price) || 0;
  return toPersianDigits(num.toLocaleString("fa-IR"));
};

/**
 * Returns human-readable relative Persian time string (e.g. «۲ روز پیش» or «همین الان»)
 * @param {string|Date|number} dateInput
 * @returns {string}
 */
export const getRelativeTime = (dateInput) => {
  if (!dateInput) return "";
  try {
    const now = new Date();
    const date = new Date(dateInput);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) return toJalaliDate(dateInput);
    if (diffDay >= 1) return `${toPersianDigits(diffDay)} روز پیش`;
    if (diffHour >= 1) return `${toPersianDigits(diffHour)} ساعت پیش`;
    if (diffMin >= 1) return `${toPersianDigits(diffMin)} دقیقه پیش`;
    return "همین الان";
  } catch {
    return toJalaliDate(dateInput);
  }
};


