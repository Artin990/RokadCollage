import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { catchError, HandleERROR } from "vanta-api";
import { exportValidation } from "./Middleware/ExportValidation.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Utils/Swagger.js";

import authRouter from "./Modules/Auth/Auth.js";
import userRouter from "./Modules/User/User.js";
import uploadRouter from "./Modules/Upload/Upload.js";
import inPersonCourseRouter from "./Modules/InPersonCourse/InPersonCourse.js";
import virtualCourseRouter from "./Modules/VirtualCourse/VirtualCourse.js";
import teacherRouter from "./Modules/Teacher/Teacher.js";
import walletRouter from "./Modules/Wallet/Wallet.js";
import enrollmentRouter from "./Modules/Enrollment/Enrollment.js";
import commentRouter from "./Modules/Comment/Comment.js";
import blogRouter from "./Modules/Blog/Blog.js";
import seoRouter from "./Modules/Seo/Seo.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Standard security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(morgan("dev"));

const corsOptions = process.env.ALLOWED_ORIGINS
  ? { origin: process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()) }
  : {};
app.use(cors(corsOptions));

app.use(express.json({ limit: "2mb" }));
app.use(
  express.static(`${__dirname}/Public`, {
    dotfiles: "ignore",
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);
app.use(exportValidation);

// Core Modules API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/in-person-courses", inPersonCourseRouter);
app.use("/in-person-courses", inPersonCourseRouter);
app.use("/api/virtual-courses", virtualCourseRouter);
app.use("/virtual-courses", virtualCourseRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/enrollments", enrollmentRouter);
app.use("/api/comment", commentRouter);
app.use("/api/blog", blogRouter);
app.use("/api/blogs", blogRouter);
app.use("/blogs", blogRouter);
app.use("/blog", blogRouter);
app.use("/api/seo", seoRouter);

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 Not Found Handler
app.use((req, res, next) => {
  return next(new HandleERROR("مسیر مورد نظر یافت نشد", 404));
});

// Map payload limit and multer field/file size errors to 413 with clear Persian message
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large" || err.status === 413 || err.statusCode === 413) {
    err.statusCode = 413;
    err.message = "حجم داده‌های ارسالی بیش از حد مجاز است";
  } else if (err.code === "LIMIT_FIELD_VALUE" || err.code === "LIMIT_FILE_SIZE") {
    err.statusCode = 413;
    err.message = "حجم فیلد یا فایل ارسالی بیش از حد مجاز است";
  }
  next(err);
});

// Centralized Error Handling Middleware
app.use(catchError);

export default app;
