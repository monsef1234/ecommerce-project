import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  createProduct,
  getAllProducts,
  getLength,
  deleteProduct,
  getProductById,
  updateProduct,
  getLastProducts,
  toggleProductStatus,
} from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.get("/length", getLength);
router.get("/last", getLastProducts);
router.get("/:id", getProductById);
router.post("/", upload.array("images", 10), createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", upload.array("images", 10), updateProduct);
router.put("/:id/status", toggleProductStatus);

export default router;
