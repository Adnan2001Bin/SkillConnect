import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,

    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
      "X-Requested-With",
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json())
app.use(cookieParser())
// app.options("*", cors());


export default app;
