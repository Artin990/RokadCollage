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

process.on("unhandledRejection", async (err) => {
  console.error("❌ UNHANDLED REJECTION! Closing server...", err);
  if (server) {
    server.close(async () => {
      try {
        await mongoose.connection.close(false);
      } catch {}
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/**
 * Enterprise-grade Graceful Shutdown Handler
 * Intercepts termination signals (SIGTERM from Docker/K8s and SIGINT from Ctrl+C)
 * Drains in-flight HTTP requests and cleanly disconnects Mongoose connection pool.
 */
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown...`);

  // Hard timeout guard: Force exit if cleanup takes longer than 10 seconds
  const forceExitTimeout = setTimeout(() => {
    console.error("⚠️ Forceful shutdown: In-flight requests or DB cleanup exceeded 10s timeout.");
    process.exit(1);
  }, 10000);
  forceExitTimeout.unref();

  if (server) {
    server.close(async () => {
      console.log("🔒 HTTP server closed: No more incoming requests accepted.");
      try {
        await mongoose.connection.close(false);
        console.log("🍃 MongoDB connection pool cleanly closed.");
        process.exit(0);
      } catch (dbErr) {
        console.error("❌ Error closing MongoDB connection:", dbErr.message);
        process.exit(1);
      }
    });
  } else {
    mongoose.connection
      .close(false)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

