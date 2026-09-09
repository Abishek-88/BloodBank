import { Router } from "express";

import { getBankInventory, updateInventory } from "../controllers/inventoryController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { inventoryValidator } from "../validators/requestValidators.js";

const router = Router();

router.get("/", authenticate, authorize("blood_bank", "admin"), getBankInventory);
router.get("/:bankId", authenticate, getBankInventory);
router.put("/update", authenticate, authorize("blood_bank", "admin"), inventoryValidator, validateRequest, updateInventory);
router.put("/", authenticate, authorize("blood_bank", "admin"), inventoryValidator, validateRequest, updateInventory);

export default router;
