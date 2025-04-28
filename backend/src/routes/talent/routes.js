import express from "express";
import { addProject, deleteProject, updateProfile, updateProject } from "../../controller/talent/controller.js";
import { verifyToken } from "../../config/middleware.js";
import upload from "../../config/multer.js";

const router = express.Router();

router.put("/profile", verifyToken, upload.single("profileImage"), updateProfile);
router.post("/projects", verifyToken, upload.array("images", 5), addProject); // Allow up to 5 images
router.put("/projects/:projectId", verifyToken, upload.array("images", 5), updateProject);
router.delete("/projects/:projectId", verifyToken, deleteProject);

export default router;