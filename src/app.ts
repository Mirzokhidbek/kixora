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

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/** 1-ENTRANCE **/
const app = express();
app.set("trust proxy", 1);

// Configure CORS at top priority
app.use(
  cors({
    credentials: true,
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.resolve("public")));
app.use(express.static("public"));
app.use("/uploads", express.static(path.resolve("public/uploads")));
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/public/uploads", express.static(path.resolve("public/uploads")));

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
app.set("views", [path.resolve("src/views"), path.resolve("views"), path.join(__dirname, "views")]);
app.set("view engine", "ejs");

/** 4-ROUTERS **/
app.use("/admin", routerAdmin); // BSSR: EJS (Admin/Restaurant)
app.use("/", router);           // SPA: REST API (Users)

export default app;
