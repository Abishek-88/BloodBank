import { Router } from "express";

import { getCourierDeliveries, updateCourierStatus } from "../controllers/courierController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/deliveries", authenticate, authorize("courier"), getCourierDeliveries);
router.put("/status/:id", authenticate, authorize("courier"), updateCourierStatus);

export default router;
