import { Router } from "express";
import {
  createColor,
  deleteColor,
  getAllColors,
} from "../controllers/colorController";

const router = Router();

router.post("/", createColor);
router.get("/", getAllColors);
router.delete("/:id", deleteColor);

export default router;
