import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  createProduct,
  getAllProducts,
  getLength,
} from "../controllers/productController";

const router = Router();

router.post("/", upload.array("images", 10), createProduct);
router.get("/", getAllProducts);    
router.get("/length", getLength);

export default router;
