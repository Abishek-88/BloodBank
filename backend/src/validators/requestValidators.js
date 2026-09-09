import { body } from "express-validator";

export const emergencyRequestValidator = [
  body("hospitalId").isInt({ min: 1 }),
  body("bloodGroup").isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  body("componentType").isIn(["whole_blood", "platelets", "plasma", "rbc"]),
  body("unitsNeeded").isInt({ min: 1 }),
  body("urgencyLevel").isIn(["critical", "high", "medium", "low"]),
  body("latitude").isFloat(),
  body("longitude").isFloat()
];

export const inventoryValidator = [
  body("bankId").optional().isInt({ min: 1 }),
  body("bloodGroup").isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  body("componentType").isIn(["whole_blood", "platelets", "plasma", "rbc"]),
  body("unitsAvailable").isInt({ min: 0 })
];

export const assignmentValidator = [
  body("requestId").isInt({ min: 1 }),
  body("courierId").optional().isInt({ min: 1 }),
  body("bankId").optional().isInt({ min: 1 })
];

export const statusValidator = [
  body("assignmentId").isInt({ min: 1 }),
  body("status").isIn(["assigned", "picked_up", "in_transit", "delivered"])
];
