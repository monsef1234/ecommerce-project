import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  createProduct,
  getAllProducts,
  getLength,
  deleteProduct,
  getProductById,
  updateProduct,
} from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.get("/length", getLength);
router.post("/", upload.array("images", 10), createProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 10), updateProduct);

export default router;
