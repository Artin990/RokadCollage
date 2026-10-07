/**
 * Centralized configuration constants for file uploads and image processing.
 */

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_FIELD_SIZE = 2 * 1024 * 1024; // 2 MB

export const MAX_IMAGE_WIDTH = 1600; // pixels

export const WEBP_QUALITY = 82; // 0 - 100

export const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|svg|webp/;

export const VALID_IMAGE_EXT_REGEX = /\.(jpe?g|png|svg|webp)$/i;
