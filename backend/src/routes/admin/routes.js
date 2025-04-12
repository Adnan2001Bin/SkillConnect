import express from "express";
import { restrictToAdmin, verifyToken } from "../../config/middleware.js";
import upload from "../../config/multer.js";
import { addTalent, deleteTalent, getTalents, updateTalent } from "../../controller/admin/controller.js";

const router =express.Router()

router.post("/add-talent", verifyToken, restrictToAdmin, upload.single("profileImage"), addTalent);
router.get("/talents", verifyToken, getTalents);
router.delete("/talents/:id", verifyToken, restrictToAdmin, deleteTalent); 
router.put("/talents/:id", verifyToken, restrictToAdmin, upload.single("profileImage"), updateTalent); 

export default router;