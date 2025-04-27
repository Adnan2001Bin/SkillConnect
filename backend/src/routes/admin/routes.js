import express from "express";
import { restrictToAdmin, verifyToken } from "../../config/middleware.js";
import upload from "../../config/multer.js";
import { addTalent, approveTalentApplication, deleteTalent, getTalentApplications, getTalents, rejectTalentApplication, updateTalent } from "../../controller/admin/controller.js";

const router =express.Router()

router.post("/add-talent", verifyToken, restrictToAdmin, upload.single("profileImage"), addTalent);
router.get("/talents", verifyToken, getTalents);
router.delete("/talents/:id", verifyToken, restrictToAdmin, deleteTalent); 
router.put("/talents/:id", verifyToken, restrictToAdmin, upload.single("profileImage"), updateTalent); 

router.get("/talent-applications", verifyToken, restrictToAdmin, getTalentApplications);
router.post("/talent-applications/:id/approve", verifyToken, restrictToAdmin, approveTalentApplication);
router.post("/talent-applications/:id/reject", verifyToken, restrictToAdmin, rejectTalentApplication);

export default router;