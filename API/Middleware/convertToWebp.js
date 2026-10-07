import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { catchAsync, HandleERROR } from "vanta-api";
import {
  MAX_FILE_SIZE,
  MAX_IMAGE_WIDTH,
  WEBP_QUALITY,
} from "../Utils/uploadConfig.js";

const __filename = fileURLToPath(import.meta.url);
const apiDir = path.resolve(path.dirname(__filename), "..");
const publicDir = path.join(apiDir, "Public");

/**
 * Processes an in-memory uploaded file buffer:
 * - If the file is SVG (vector), it bypasses sharp and is saved directly with .svg extension.
 * - If the file is a raster image (JPG, PNG, WEBP), it is resized to max MAX_IMAGE_WIDTH (preserving aspect ratio)
 *   and converted to WebP format (quality: WEBP_QUALITY) before saving to disk.
 *
 * @param {Express.Multer.File} file
 */
const processFile = async (file) => {
  if (!file || !file.buffer) return;

  if (
    (file.size && file.size > MAX_FILE_SIZE) ||
    (file.buffer && file.buffer.length > MAX_FILE_SIZE)
  ) {
    throw new HandleERROR(
      "حجم فایل ارسالی بیش از ۵ مگابایت است (حداکثر حجم مجاز: ۵ مگابایت)",
      400
    );
  }

  if (file.originalname && file.originalname.toLowerCase().startsWith("default-")) {
    throw new HandleERROR("استفاده از نام‌های رزرو شده سیستم (مثل default-) مجاز نیست", 403);
  }

  const rawBaseName = path.parse(file.originalname).name;
  const cleanName = rawBaseName.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 60) || "upload";
  const timestamp = Date.now();

  const isSvg =
    file.mimetype === "image/svg+xml" ||
    path.extname(file.originalname).toLowerCase() === ".svg";

  if (isSvg) {
    const svgContent = file.buffer.toString("utf8");
    const dangerousPatterns = /<script\b|javascript:|on\w+\s*=/i;
    if (dangerousPatterns.test(svgContent)) {
      throw new HandleERROR("فایل SVG ارسالی حاوی کدهای غیرمجاز اسکریپتی است", 400);
    }

    // Save SVG buffer directly to avoid rasterization
    const finalFilename = `${cleanName}_${timestamp}.svg`;
    const finalPath = path.join(publicDir, finalFilename);
    await fs.promises.writeFile(finalPath, file.buffer);

    file.filename = finalFilename;
    file.path = finalPath;
    return;
  }

  // Raster image: Resize if width > MAX_IMAGE_WIDTH, then convert to WebP
  const finalFilename = `${cleanName}_${timestamp}.webp`;
  const finalPath = path.join(publicDir, finalFilename);

  const image = sharp(file.buffer);
  const metadata = await image.metadata();

  if (metadata.width && metadata.width > MAX_IMAGE_WIDTH) {
    image.resize({
      width: MAX_IMAGE_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const webpBuffer = await image.webp({ quality: WEBP_QUALITY }).toBuffer();
  await fs.promises.writeFile(finalPath, webpBuffer);

  file.filename = finalFilename;
  file.path = finalPath;
  file.mimetype = "image/webp";
  file.size = webpBuffer.length;
};

/**
 * Express middleware to convert raster uploaded image buffers into WebP format before disk storage.
 */
export const convertToWebp = catchAsync(async (req, res, next) => {
  if (!fs.existsSync(publicDir)) {
    await fs.promises.mkdir(publicDir, { recursive: true });
  }

  if (req.file) {
    await processFile(req.file);
  } else if (Array.isArray(req.files) && req.files.length > 0) {
    await Promise.all(req.files.map((file) => processFile(file)));
  }

  next();
});

export default convertToWebp;
