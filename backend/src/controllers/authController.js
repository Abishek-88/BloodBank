import { StatusCodes } from "http-status-codes";

import UserModel from "../models/UserModel.js";
import ProfileModel from "../models/ProfileModel.js";
import { comparePassword, generateToken, hashPassword } from "../services/authService.js";
import ApiError from "../utils/ApiError.js";

export const register = async (req, res, next) => {
  try {
    const existingUser = await UserModel.findByEmail(req.body.email);
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email is already in use");
    }

    const password = await hashPassword(req.body.password);
    const user = await UserModel.create({ ...req.body, password });

    await ProfileModel.createProfile(user.role, {
      userId: user.id,
      organizationName: req.body.organizationName || req.body.name,
      address: req.body.address || null,
      latitude: req.body.latitude || null,
      longitude: req.body.longitude || null,
      serviceRadiusKm: req.body.serviceRadiusKm || 25
    });

    const token = generateToken(user);
    res.status(StatusCodes.CREATED).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const fullUser = await UserModel.findByEmail(req.body.email);
    if (!fullUser) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const isMatch = await comparePassword(req.body.password, fullUser.password);
    if (!isMatch) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const safeUser = await UserModel.findById(fullUser.id);
    res.json({ user: safeUser, token: generateToken(safeUser) });
  } catch (error) {
    next(error);
  }
};