import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrdersCount,
  getAllOrdersPriceTotal,
  getDeliveredOrdersCount,
  getNotDeliveredOrdersCount,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController";

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);
router.get("/count", getAllOrdersCount);
router.get("/delivered-count", getDeliveredOrdersCount);
router.get("/not-delivered-count", getNotDeliveredOrdersCount);
router.get("/total-price", getAllOrdersPriceTotal);

export default router;
