import express from "express";
import { restrictToAdmin, verifyToken } from "../../config/middleware.js";
import upload from "../../config/multer.js";
import { addTalent } from "../../controller/admin/controller.js";

const router =express.Router()

router.post("/add-talent", verifyToken, restrictToAdmin, upload.single("profileImage"), addTalent);

export default router;