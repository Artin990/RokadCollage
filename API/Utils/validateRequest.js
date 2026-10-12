import Joi from "joi";
import { VALID_IMAGE_EXT_REGEX } from "./uploadConfig.js";

/**
 * Canonical regular expression patterns used across validation schemas.
 * Serves as the Single Source of Truth for format validators.
 *
 * safeTextRegex allows:
 * - Persian, Arabic, and Latin alphabets
 * - English digits (0-9), Persian digits (۰-۹), Arabic digits (٠-٩)
 * - Standard punctuation & symbols: / \ + # & % @ | * ~ = ^ ! ? ؟ ، ؛ : . … - _ – — ( ) [ ] { } < > « » " ' ’ ” $
 * - Whitespace, tabs, newlines, zero-width non-joiner (\u200c) and joiner (\u200d)
 */
export const safeTextRegex = /^[\u0600-\u06FF\u0750-\u077F\sA-Za-z0-9\u06F0-\u06F9\u0660-\u0669\-\_،؛؟!.:«»",;?()\/\\+&#%@|*~=^!\[\]{}'"`—–…\u200c\u200d\u00A0\r\n\t<>$€£°]+$/;
export const phoneRegex = /^(\+98|\+۹۸|0|۰)?(9|۹)[\d\u06F0-\u06F9\u0660-\u0669]{9}$/;
export const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const birthDateRegex = /^[\d\u06F0-\u06F9]{4}[\/\-][\d\u06F0-\u06F9]{1,2}[\/\-][\d\u06F0-\u06F9]{1,2}$/;
// Re-export canonical alias for objectIdRegex without duplicating the regex pattern
export const hex24Regex = objectIdRegex;
export { VALID_IMAGE_EXT_REGEX };

/**
 * Converts Persian and Arabic digits to English digits.
 *
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
 * Converts Persian/Arabic digits, standardizes separators (- to /),
 * and pads single-digit months and days with leading zeros.
 *
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

/**
 * Factory for Joi validators on route parameters expecting 24-character hexadecimal ObjectIds.
 *
 * @param {...string} paramNames
 */
export const createObjectIdParamsValidator = (...paramNames) => {
  const schemaObj = {};
  paramNames.forEach((name) => {
    schemaObj[name] = Joi.string()
      .trim()
      .pattern(objectIdRegex)
      .required()
      .messages({
        "string.base": "شناسه ارسالی نامعتبر است",
        "string.empty": "شناسه نمی‌تواند خالی باشد",
        "string.pattern.base": "شناسه ارسالی باید یک شناسه معتبر ۲۴ کاراکتری باشد",
        "any.required": "ارسال شناسه الزامی است",
      });
  });
  return Joi.object(schemaObj);
};

/**
 * Common Joi validator for standard :id route parameters.
 */
export const objectIdParamValidator = createObjectIdParamsValidator("id");

/**
 * Express middleware to validate request payload (body, params, or query) against a Joi schema.
 *
 * @param {import("joi").Schema} schema
 * @param {"body"|"params"|"query"} [property="body"]
 */
export const validateRequest = (schema, property = "body", options = {}) => {
  return (req, res, next) => {
    const dataToValidate = req[property] || {};
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: true,
      stripUnknown: options.stripUnknown !== undefined ? options.stripUnknown : true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Assign sanitized/trimmed values back
    // In Express 5, req.query has only a getter on IncomingMessage prototype; define own property to safely override
    if (property === "query") {
      Object.defineProperty(req, "query", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: value,
      });
    } else {
      try {
        req[property] = value;
      } catch {
        Object.defineProperty(req, property, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: value,
        });
      }
    }
    next();
  };
};

export const validateParams = (schema) => validateRequest(schema, "params");
export const validateQuery = (schema) => validateRequest(schema, "query");

export default validateRequest;
