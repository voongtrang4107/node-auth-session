import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

await mongoose.connect("mongodb://localhost:27017/session_demo");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.use(session({
    name: "sid",
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/session_demo",
        collectionName: "sessions"
    }),
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("Server at http://localhost:3000"));