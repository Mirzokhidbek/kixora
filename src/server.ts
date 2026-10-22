import "dotenv/config"; // must be first: config.ts reads process.env at import time
import { initMonitoring, flushMonitoring } from "./libs/logger";
initMonitoring();
import mongoose from "mongoose";
import { env } from "./libs/config";
import app from "./app";
import { closeRedis } from "./libs/redis";
import { logger } from "./libs/logger";

mongoose.set("strictQuery", true);

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled promise rejection", { err: reason });
});

// An uncaught exception leaves the process in an unknown state: log and exit so
// the process manager (PM2 / Railway) restarts a clean instance.
process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception, exiting", { err });
  flushMonitoring().finally(() => process.exit(1));
});

// Listen immediately so platform health checks pass while the DB connects
const server = app.listen(env.port, "0.0.0.0", () => {
  logger.info("KIXORA server started", {
    port: env.port,
    admin: `http://localhost:${env.port}/admin`,
    api: `http://localhost:${env.port}/`,
    paymentMode: env.paymentMode,
    redis: Boolean(env.redisUrl),
  });
});

mongoose
  .connect(env.mongoUrl)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => {
    logger.error("MongoDB connection failed", { err });
    if (env.isProduction) process.exit(1);
  });

// Graceful shutdown: finish in-flight requests, then close the DB connection
const shutdown = (signal: string) => {
  logger.info("Shutting down", { signal });
  server.close(() => {
    Promise.allSettled([mongoose.connection.close(), closeRedis()]).finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
