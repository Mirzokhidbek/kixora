import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

mongoose.set("strictQuery", true);

const mongoUrl = process.env.MONGO_URL as string;

mongoose
  .connect(mongoUrl, {})
  .then(() => {
    console.log("MongoDB connection succeed");
    const PORT = Number(process.env.PORT) || 3001;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`The server is running successfully on port: ${PORT}`);
      console.log(`BSSR Admin: http://localhost:${PORT}/admin`);
      console.log(`SPA REST API: http://localhost:${PORT}/`);
    });
  })
  .catch((err) => console.log("ERROR on connection MongoDB", err));
