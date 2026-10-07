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
