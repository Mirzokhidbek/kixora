import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./routerAdmin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";

const mongoUri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/burak";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: mongoUri,
  collection: "sessions",
});

// Catch session store connection errors to prevent process crashing
store.on("error", (error) => {
  console.log("⚠️ Session store connection warning:", error?.message || error);
});

/** 1-ENTRANCE **/
const app = express();
app.set("trust proxy", 1);

// Configure CORS at top priority for all incoming requests
app.use(
  cors({
    credentials: true,
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  })
);

// Serve static assets from both src/public and root public
app.use(express.static(path.resolve("src/public")));
app.use(express.static(path.resolve("public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../src/public")));
app.use(express.static(path.join(__dirname, "../public")));

// Serve static uploads
app.use("/uploads", express.static(path.resolve("public/uploads")));
app.use("/uploads", express.static(path.resolve("src/public/uploads")));
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/public/uploads", express.static(path.resolve("public/uploads")));
app.use("/public/uploads", express.static(path.resolve("src/public/uploads")));

// Fallback for missing uploaded images in production
app.use("/uploads/products", (req, res) => {
  res.redirect("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80");
});
app.use("/uploads/members", (req, res) => {
  res.redirect("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
});
app.use("/uploads", (req, res) => {
  res.redirect("https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/
const isProduction = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: String(process.env.SESSION_SECRET || "BURAK_SESSION_SECRET"),
    cookie: {
      maxAge: 1000 * 3600 * 6, // 6 hours
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.member = req.session?.member;
  next();
});

/** 3-VIEWS **/
app.set("views", [
  path.resolve("src/views"),
  path.resolve("views"),
  path.join(__dirname, "views"),
  path.join(__dirname, "../src/views"),
]);
app.set("view engine", "ejs");

/** 4-ROUTERS **/
// Root health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Burak Luxury Restaurant API is Running 🚀",
    adminPanel: "/admin",
    docs: "SPA REST API",
    status: "HEALTHY",
  });
});

app.use("/admin", routerAdmin); // BSSR: EJS (Admin/Restaurant)
app.use("/", router);           // SPA: REST API (Users)

export default app;
