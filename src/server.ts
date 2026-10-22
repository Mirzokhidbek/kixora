import "dotenv/config"; // must be first: config.ts reads process.env at import time
import mongoose from "mongoose";
import { env } from "./libs/config";
import app from "./app";

mongoose.set("strictQuery", true);

process.on("unhandledRejection", (reason: any) => {
  console.error("⚠️ Unhandled Rejection:", reason?.message || reason);
});

// An uncaught exception leaves the process in an unknown state: log and exit so
// the process manager (PM2 / Railway) restarts a clean instance.
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

// Listen immediately so platform health checks pass while the DB connects
const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`========================================`);
  console.log(`🚀 KIXORA Server running on Port: ${env.port}`);
  console.log(`👑 Admin: http://localhost:${env.port}/admin`);
  console.log(`🌐 REST API: http://localhost:${env.port}/`);
  console.log(`========================================`);
});

mongoose
  .connect(env.mongoUrl)
  .then(() => console.log("✅ MongoDB connection succeeded"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    if (env.isProduction) process.exit(1);
  });

// Graceful shutdown: finish in-flight requests, then close the DB connection
const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down...`);
  server.close(() => {
    mongoose.connection.close().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
