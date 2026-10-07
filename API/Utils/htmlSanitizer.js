import sanitizeHtml from "sanitize-html";

/**
 * Maximum character length allowed for blog HTML content (200,000 characters).
 */
export const MAX_BLOG_CONTENT_LENGTH = 200000;

/**
 * Whitelist of permitted HTML tags for blog articles.
 * All tags outside this list will be discarded.
 */
export const ALLOWED_BLOG_TAGS = [
  "p", "br", "hr",
  "h2", "h3", "h4", "h5", "h6",
  "strong", "em", "u", "s", "mark", "small", "sub", "sup",
  "blockquote",
  "ul", "ol", "li",
  "a", "img",
  "figure", "figcaption",
  "table", "caption", "thead", "tbody", "tfoot", "tr", "th", "td",
  "code", "pre",
  "div", "span", "section",
];

/**
 * Whitelist of permitted attributes per HTML tag.
 * Note: class, style, id, and all event handlers (on*) are strictly disallowed.
 */
export const ALLOWED_BLOG_ATTRIBUTES = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
};

/**
 * Permitted URL schemes for links.
 */
export const ALLOWED_BLOG_SCHEMES = ["http", "https", "mailto", "tel"];

/**
 * Disallowed tags whose inner text content must also be discarded completely.
 */
export const DISALLOWED_NON_TEXT_TAGS = [
  "script", "style", "iframe", "object", "embed", "form", "textarea", "button",
];

/**
 * Canonical configuration options passed to sanitize-html.
 */
export const BLOG_SANITIZER_CONFIG = {
  allowedTags: ALLOWED_BLOG_TAGS,
  allowedAttributes: ALLOWED_BLOG_ATTRIBUTES,
  allowedSchemes: ALLOWED_BLOG_SCHEMES,
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  nonTextTags: DISALLOWED_NON_TEXT_TAGS,
  transformTags: {
    h1: "h2",
    b: "strong",
    i: "em",
    a: (tagName, attribs) => ({
      tagName: "a",
      attribs: {
        ...attribs,
        target: "_blank",
        rel: "noopener noreferrer",
      },
    }),
    img: (tagName, attribs) => ({
      tagName: "img",
      attribs: {
        ...attribs,
        loading: "lazy",
      },
    }),
  },
};

/**
 * Pure server-side HTML sanitizer for blog content.
 * Guarantees idempotency: sanitize(sanitize(html)) === sanitize(html)
 *
 * @param {string} dirtyHtml - Untrusted input HTML string
 * @returns {string} Sanitized safe HTML string
 */
export const sanitizeBlogHtml = (dirtyHtml) => {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";
  return sanitizeHtml(dirtyHtml, BLOG_SANITIZER_CONFIG);
};

export default sanitizeBlogHtml;
