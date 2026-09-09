import { Router } from "express";

import {
  deleteUser,
  getAnalytics,
  listAssignments,
  listLogs,
  listRequests,
  listUsers,
  updateUserStatus,
  updateVerification
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/users", authenticate, authorize("admin"), listUsers);
router.put("/user/:id", authenticate, authorize("admin"), updateUserStatus);
router.delete("/user/:id", authenticate, authorize("admin"), deleteUser);
router.put("/verification/:type/:id", authenticate, authorize("admin"), updateVerification);
router.get("/requests", authenticate, authorize("admin"), listRequests);
router.get("/assignments", authenticate, authorize("admin"), listAssignments);
router.get("/logs", authenticate, authorize("admin"), listLogs);
router.get("/analytics", authenticate, authorize("admin"), getAnalytics);

export default router;
