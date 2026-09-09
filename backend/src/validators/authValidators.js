import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("role").isIn(["hospital", "blood_bank", "courier", "admin"])
];

export const loginValidator = [body("email").isEmail(), body("password").notEmpty()];