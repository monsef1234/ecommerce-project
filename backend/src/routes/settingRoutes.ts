import { Router } from "express";
import { getSetting, updateSetting } from "../controllers/settingController";
import { upload } from "../middlewares/upload";

const router = Router();

router.get("/", getSetting);
router.put("/", upload.single("logo"), updateSetting);

export default router;
