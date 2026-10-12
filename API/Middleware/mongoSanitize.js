import { sanitize } from "express-mongo-sanitize";

/**
 * Express 5 compatible MongoSanitize middleware.
 * Strips prohibited MongoDB query operators ($ and .) from req.body, req.params,
 * req.headers, and req.query to prevent NoSQL injection attacks.
 *
 * Solves the Express 5 `TypeError: Cannot set property query of #<IncomingMessage>`
 * by safely defining req.query property descriptor.
 *
 * @param {Object} [options]
 * @param {string} [options.replaceWith="_"] - Replacement character for prohibited keys (default: "_")
 * @param {boolean} [options.allowDots=false] - Whether to allow dots in keys (default: false)
 * @returns {import("express").RequestHandler}
 */
export const mongoSanitize = (options = { replaceWith: "_" }) => {
  return (req, res, next) => {
    ["body", "params", "headers"].forEach((key) => {
      if (req[key]) {
        sanitize(req[key], options);
      }
    });

    if (req.query) {
      const clonedQuery = { ...req.query };
      sanitize(clonedQuery, options);
      Object.defineProperty(req, "query", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: clonedQuery,
      });
    }

    next();
  };
};

export default mongoSanitize;
