import { Router } from "express";

import { login, register } from "../controllers/authController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/register", authenticate, authorize("admin"), registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);

export default router;
