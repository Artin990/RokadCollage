import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const utilsDir = path.dirname(__filename);
const publicDir = path.resolve(utilsDir, "../Public");

/**
 * Safely removes a file from the Public directory.
 * Ignores empty names, default system avatars, and SVG tags.
 *
 * @param {string} filename - The file name or path relative to Public
 * @returns {boolean} True if deleted, false otherwise
 */
export const removePublicFile = (filename) => {
  if (!filename || typeof filename !== "string") return false;

  const trimmed = filename.trim();
  if (
    trimmed.startsWith("<") ||
    trimmed.startsWith("default-") ||
    trimmed.startsWith("default")
  ) {
    return false;
  }

  const baseFilename = path.basename(trimmed);
  const targetPath = path.join(publicDir, baseFilename);

  if (fs.existsSync(targetPath)) {
    try {
      fs.unlinkSync(targetPath);
      return true;
    } catch (err) {
      console.error(`Error deleting file (${baseFilename}):`, err.message);
      return false;
    }
  }

  return false;
};

export default removePublicFile;
