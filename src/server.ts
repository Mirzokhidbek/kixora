import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

mongoose.set("strictQuery", true);

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/burak";

const PORT = Number(process.env.PORT) || 3001;

// Global process error handlers to keep cloud container alive and log issues
process.on("uncaughtException", (err) => {
  console.log("⚠️ Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("⚠️ Unhandled Rejection:", reason?.message || reason);
});

// Start Express server immediately for cloud health checks
app.listen(PORT, "0.0.0.0", () => {
  console.log(`========================================`);
  console.log(`🚀 Burak Server running on Port: ${PORT}`);
  console.log(`👑 BSSR Admin: http://0.0.0.0:${PORT}/admin`);
  console.log(`🌐 SPA REST API: http://0.0.0.0:${PORT}/`);
  console.log(`========================================`);
});

// Connect to MongoDB Database
if (process.env.MONGO_URL) {
  mongoose
    .connect(mongoUrl, {})
    .then(() => {
      console.log("✅ MongoDB Atlas connection succeed!");
    })
    .catch((err) => {
      console.log("❌ ERROR on connection MongoDB:", err.message);
      console.log("💡 Tip: Ensure MongoDB Atlas has Network Access set to 0.0.0.0/0 (Allow from anywhere).");
    });
} else {
  console.log("⚠️ WARNING: MONGO_URL environment variable is not defined in Railway Variables!");
}
