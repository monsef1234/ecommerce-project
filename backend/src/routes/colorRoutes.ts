import { Router } from "express";
import {
  createColor,
  deleteColor,
  getAllColors,
  totalColors,
} from "../controllers/colorController";

const router = Router();

router.post("/", createColor);
router.get("/", getAllColors);
router.delete("/:id", deleteColor);
router.get("/length", totalColors);

export default router;
