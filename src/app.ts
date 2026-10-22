import express from "express";
import path from "path";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import router from "./router";
import routerAdmin from "./routerAdmin";
import { noSqlSanitizer } from "./libs/sanitizer";
import { MORGAN_FORMAT, env } from "./libs/config";
import { globalLimiter } from "./libs/rateLimiter";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import { contentSecurityPolicy, cspNonce } from "./middlewares/csp";
import { logger } from "./libs/logger";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({ uri: env.mongoUrl, collection: "sessions" });
store.on("error", (error) => {
  logger.warn("Session store connection problem", { err: error });
});

/** 1-ENTRANCE **/
const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

// HTTP security headers + Content-Security-Policy with per-request script nonces
app.use(
  helmet({
    contentSecurityPolicy: false, // configured separately below (needs the nonce)
    crossOriginResourcePolicy: { policy: "cross-origin" }, // lets the SPA display uploaded images
  })
);
app.use(cspNonce);
app.use(contentSecurityPolicy);

// CORS: only configured origins may send credentialed requests
app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without Origin (curl, server-to-server, same-origin navigations)
      if (!origin) return callback(null, true);
      callback(null, env.allowedOrigins.includes(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["X-Total-Count"],
  })
);

// Static assets (admin css/js/img) and uploaded images
app.use(express.static(path.resolve("src/public")));
app.use("/uploads", express.static(env.uploadDir));
app.use("/uploads", express.static(path.resolve("uploads"))); // legacy upload location
app.use("/uploads", (_req, res) => {
  res.status(404).send("File not found");
});
app.use(express.static(path.resolve("public")));

app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
// path without query string: search terms / ids in queries stay out of the logs
morgan.token("path", (req) => (req as express.Request).originalUrl.split("?")[0]);
app.use(morgan(MORGAN_FORMAT));

// NoSQL query injection protection (removes $ and . keys)
app.use(noSqlSanitizer);
app.use(globalLimiter);

/** 2-SESSIONS (admin panel only) **/
app.use(
  "/admin",
  session({
    secret: env.sessionSecret,
    cookie: {
      maxAge: 1000 * 3600 * 6, // 6 hours
      httpOnly: true,
      // The admin panel is same-site, so "lax" blocks cross-site form posts (CSRF)
      sameSite: "lax",
      secure: env.isProduction,
    },
    store,
    resave: false,
    saveUninitialized: false, // no DB session for anonymous visitors
  })
);

app.use("/admin", (req, res, next) => {
  res.locals.member = req.session?.member;
  next();
});

/** 3-VIEWS **/
app.set("views", [path.resolve("src/views"), path.join(__dirname, "views")]);
app.set("view engine", "ejs");

/** 4-ROUTERS **/
// Health check (also reports DB connectivity for the platform)
app.get("/", (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    message: "KIXORA Luxury Footwear API",
    status: dbConnected ? "healthy" : "degraded",
    database: dbConnected ? "connected" : "disconnected",
  });
});

app.use("/admin", routerAdmin); // BSSR: EJS admin panel
app.use("/", router); // SPA: REST API

app.use(notFound);
app.use(errorHandler);

export default app;
