import { Router } from "express";

import { createEmergencyRequest, listRequests, updateBloodBankRequest } from "../controllers/requestController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { emergencyRequestValidator } from "../validators/requestValidators.js";

const router = Router();

router.get("/", authenticate, listRequests);
router.post("/", authenticate, authorize("hospital", "admin"), emergencyRequestValidator, validateRequest, createEmergencyRequest);
router.put("/:id", authenticate, authorize("blood_bank", "admin"), updateBloodBankRequest);

export default router;
