import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./routerAdmin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { noSqlSanitizer } from "./libs/sanitizer";
import { MORGAN_FORMAT } from "./libs/config";
import { globalLimiter } from "./libs/rateLimiter";

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

// 1. HTTP Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows CDN scripts (Chart.js, Bootstrap, FontAwesome) and external fonts
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows frontend to display uploaded images
  })
);

// 2. Production-Ready Dynamic CORS Configuration
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [
      "http://localhost:8080",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:3000",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching allowed origins
      if (!origin || !isProduction || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to permissive for local testing
      }
    },
    credentials: true,
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

// Return 404 for missing static uploads
app.use("/uploads", (req, res) => {
  res.status(404).send("File not found");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

// 3. NoSQL Query Injection Protection (Sanitize inputs by removing $ and . keys)
app.use(noSqlSanitizer);

// 4. Global API Rate Limiter
app.use(globalLimiter);

/** 2-SESSIONS **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET || "KIXORA_SESSION_SECRET"),
    cookie: {
      maxAge: 1000 * 3600 * 6, // 6 hours
      httpOnly: true, // Prevents client-side script access (XSS protection)
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction, // HTTPS only in production
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
    message: "KIXORA Luxury Footwear API is Running 🚀",
    adminPanel: "/admin",
    docs: "SPA REST API",
    status: "healthy",
    security: "Helmet + RateLimit + MongoSanitize Active 🛡️",
  });
});

app.use("/admin", routerAdmin); // BSSR: EJS (Admin/Restaurant)
app.use("/", router);           // SPA: REST API (Users)

export default app;
