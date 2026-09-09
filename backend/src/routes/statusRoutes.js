import { Router } from "express";

import { getRequestLogs, updateStatus } from "../controllers/statusController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { statusValidator } from "../validators/requestValidators.js";

const router = Router();

router.put("/", authenticate, authorize("courier", "blood_bank", "admin"), statusValidator, validateRequest, updateStatus);
router.get("/logs/:requestId", authenticate, getRequestLogs);

export default router;