import UserModel from "../models/UserModel.js";
import AdminModel from "../models/AdminModel.js";
import { getDashboardAnalytics } from "../services/analyticsService.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await UserModel.list(req.query);
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (_req, res, next) => {
  try {
    const analytics = await getDashboardAnalytics();
    res.json({ data: analytics });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await UserModel.updateStatus(req.params.id, Boolean(req.body.isActive));
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await UserModel.deleteById(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const listRequests = async (req, res, next) => {
  try {
    const requests = await AdminModel.listRequests(req.query);
    res.json({ data: requests });
  } catch (error) {
    next(error);
  }
};

export const listAssignments = async (_req, res, next) => {
  try {
    const assignments = await AdminModel.listAssignments();
    res.json({ data: assignments });
  } catch (error) {
    next(error);
  }
};

export const listLogs = async (req, res, next) => {
  try {
    const logs = await AdminModel.listLogs(req.query);
    res.json({ data: logs });
  } catch (error) {
    next(error);
  }
};

export const updateVerification = async (req, res, next) => {
  try {
    const record = await AdminModel.updateOrganizationVerification(
      req.params.type,
      req.params.id,
      req.body.verificationStatus
    );
    res.json({ data: record });
  } catch (error) {
    next(error);
  }
};
