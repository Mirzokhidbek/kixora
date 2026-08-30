import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

mongoose.set("strictQuery", true);

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/burak";

const PORT = Number(process.env.PORT) || 3001;

// Start Express server immediately for cloud health checks
app.listen(PORT, "0.0.0.0", () => {
  console.log(`========================================`);
  console.log(`🚀 Burak Server running on Port: ${PORT}`);
  console.log(`👑 BSSR Admin: http://0.0.0.0:${PORT}/admin`);
  console.log(`🌐 SPA REST API: http://0.0.0.0:${PORT}/`);
  console.log(`========================================`);
});

// Connect to MongoDB Database
mongoose
  .connect(mongoUrl, {})
  .then(() => {
    console.log("✅ MongoDB Atlas connection succeed!");
  })
  .catch((err) => {
    console.log("❌ ERROR on connection MongoDB:", err.message);
    console.log("💡 Check your MONGO_URL in Railway Variables and MongoDB Atlas Network Access (0.0.0.0/0).");
  });
