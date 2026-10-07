import multer from "multer";
import path from "path";
import { HandleERROR } from "vanta-api";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, MAX_FIELD_SIZE } from "./uploadConfig.js";

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const extname = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimetype = ALLOWED_IMAGE_TYPES.test(file.mimetype) || file.mimetype === "image/svg+xml";
  if (extname && mimetype) {
    return cb(null, true);
  }
  return cb(new HandleERROR("فرمت فایل غیرمجاز است (فقط JPG، PNG، SVG، WEBP مجاز است)", 400));
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    fieldSize: MAX_FIELD_SIZE,
  },
});

export default upload;
