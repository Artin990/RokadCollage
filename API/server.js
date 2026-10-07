process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down gracefully...", err);
  process.exit(1);
});

import app, { __dirname } from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: `${__dirname}/config.env` });

// Fail-fast verification of essential environment variables
const REQUIRED_ENV_VARS = ["DATA_BASE", "JWT_SECRET"];
for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    console.error(`❌ FATAL: Required environment variable "${envVar}" is not defined.`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 5000;

let server;

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    console.log("✅ Database connected successfully (RokadCollage)");

    server = app.listen(PORT, () => {
      console.log(`🚀 Rokad Collage API is running on port ${PORT}`);
      console.log(`📑 Swagger Documentation: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! Closing server...", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

