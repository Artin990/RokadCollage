import Joi from "joi";
import { VALID_IMAGE_EXT_REGEX } from "./uploadConfig.js";

/**
 * Canonical regular expression patterns used across validation schemas.
 * Serves as the Single Source of Truth for format validators.
 */
export const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;
export const phoneRegex = /^(\+98|0)?9\d{9}$/;
export const objectIdRegex = /^[0-9a-fA-F]{24}$/;
// Re-export canonical alias for objectIdRegex without duplicating the regex pattern
export const hex24Regex = objectIdRegex;
export { VALID_IMAGE_EXT_REGEX };

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
export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[property] || {};
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: true,
      stripUnknown: false,
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
