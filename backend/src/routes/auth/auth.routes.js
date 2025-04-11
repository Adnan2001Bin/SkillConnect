import express from "express";
import { isAuthenticated, loginUser, logoutUser, registerUser } from "../../controller/auth/controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/is-auth", isAuthenticated);
router.post("/logout", logoutUser);

export default router;
