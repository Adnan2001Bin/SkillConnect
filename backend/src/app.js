import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth.routes.js"
import adminRouter from "./routes/admin/routes.js"
import talentRoutes from "./routes/talent/routes.js";
import publicRoutes from "./routes/public/routes.js";


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

app.use("/api/auth" , authRouter)
app.use("/api/admin" , adminRouter)
app.use("/api/talent", talentRoutes);
app.use("/api/public", publicRoutes);



export default app;
