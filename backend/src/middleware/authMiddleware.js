import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import UserModel from "../models/UserModel.js";
import ApiError from "../utils/ApiError.js";

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Authentication token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(StatusCodes.FORBIDDEN, "Access denied"));
  }

  next();
};