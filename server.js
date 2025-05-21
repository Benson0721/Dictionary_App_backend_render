import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import { User } from "./models/UserSchema.js";
import { router as UserRoutes } from "./routes/user-routes.js";
import { router as FavRoutes } from "./routes/fav-routes.js";
import passport from "passport";
import express from "express";
import LocalStrategy from "passport-local";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

// 獲取當前檔案的路徑
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  // 動態解析 .env 的絕對路徑
  const envPath = path.resolve(__dirname, ".env");
  console.log("Loading .env from:", envPath);

  // 檢查 .env 檔案是否存在
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env file not found at: ${envPath}`);
  }

  // 加載環境變數
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw new Error(`Failed to load .env: ${result.error.message}`);
  }
}

const DBURL = process.env.DB_URL;
if (!DBURL) {
  throw new Error("DB_URL is not defined in .env");
}

const connectToDB = async () => {
  try {
    await mongoose.connect(DBURL);
    console.log("connection successful");
  } catch (err) {
    console.error(err);
  }
};

connectToDB();
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const store = MongoStore.create({
  mongoUrl: DBURL,
  collectionName: "sessions",
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const app = express();

const port = process.env.PORT || 5000;

app.set("trust proxy", 1);

const whiteList = [
  "https://dictionary-app-frontend-vercel.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // 多網址
      if (
        !origin ||
        whiteList.some((allowedOrigin) => origin.startsWith(allowedOrigin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const sessionConfig = {
  store,
  name: "session",
  secret: "thisismysecert",
  resave: false,
  saveUninitialized: false,
  unset: "destroy",
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

if (process.env.NODE_ENV === "production") {
  app.use("/api", UserRoutes);
  app.use("/api", FavRoutes);
} else {
  app.use("/", UserRoutes);
  app.use("/", FavRoutes);
}

app.get("/wakeup", (req, res) => {
  console.log("ok!ok!....I am wakeup!");
  res.send("Allright...I have wake up...");
});

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

app.on("error", (err) => {
  console.error("Server error:", err);
});
