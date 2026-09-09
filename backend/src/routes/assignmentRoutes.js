import { Router } from "express";

import { assignCourier, listBankAssignments, listCourierAssignments } from "../controllers/assignmentController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { assignmentValidator } from "../validators/requestValidators.js";

const router = Router();

router.post("/", authenticate, authorize("blood_bank", "admin"), assignmentValidator, validateRequest, assignCourier);
router.get("/", authenticate, authorize("blood_bank", "admin"), listBankAssignments);
router.get("/courier/:courierId", authenticate, authorize("courier", "admin"), listCourierAssignments);

export default router;
