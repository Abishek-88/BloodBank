import { StatusCodes } from "http-status-codes";

import AssignmentModel from "../models/AssignmentModel.js";
import LogModel from "../models/LogModel.js";
import RequestModel from "../models/RequestModel.js";
import BloodBankModel from "../models/BloodBankModel.js";
import CourierModel from "../models/CourierModel.js";
import ApiError from "../utils/ApiError.js";

export const assignCourier = async (req, res, next) => {
  try {
    const bank =
      req.user.role === "blood_bank"
        ? await BloodBankModel.findByUserId(req.user.id)
        : { id: req.body.bankId };

    if (!bank?.id) {
      throw new ApiError(404, "Blood bank profile not found");
    }

    const courier =
      req.body.courierId ? { id: req.body.courierId } : await CourierModel.findAvailableCourier();

    if (!courier?.id) {
      throw new ApiError(400, "No available courier found");
    }

    const assignment = await AssignmentModel.create({
      requestId: req.body.requestId,
      courierId: courier.id,
      bankId: bank.id,
      assignedBy: req.user.id
    });

    const request = await RequestModel.updateStatus(req.body.requestId, "dispatched");

    await LogModel.create({
      requestId: req.body.requestId,
      assignmentId: assignment.id,
      actorUserId: req.user.id,
      actionType: "courier_assigned",
      status: "dispatched",
      details: `Courier assigned for request #${req.body.requestId}`
    });

    req.app.get("io").emit("assignment:created", { assignment, request });
    req.app.get("io").emit("assignment_created", { assignment, request });
    res.status(StatusCodes.CREATED).json({ assignment, request });
  } catch (error) {
    next(error);
  }
};

export const listCourierAssignments = async (req, res, next) => {
  try {
    const assignments = await AssignmentModel.listByCourier(req.params.courierId);
    res.json({ data: assignments });
  } catch (error) {
    next(error);
  }
};

export const listBankAssignments = async (req, res, next) => {
  try {
    const bank = await BloodBankModel.findByUserId(req.user.id);

    if (!bank?.id) {
      throw new ApiError(404, "Blood bank profile not found");
    }

    const assignments = await AssignmentModel.listByBank(bank.id, req.query);
    res.json({ data: assignments });
  } catch (error) {
    next(error);
  }
};
