import { StatusCodes } from "http-status-codes";

import RequestModel from "../models/RequestModel.js";
import InventoryModel from "../models/InventoryModel.js";
import LogModel from "../models/LogModel.js";
import { sortBanksByProximity } from "../services/geoService.js";
import BloodBankModel from "../models/BloodBankModel.js";
import AssignmentModel from "../models/AssignmentModel.js";
import CourierModel from "../models/CourierModel.js";
import HospitalModel from "../models/HospitalModel.js";
import ApiError from "../utils/ApiError.js";

export const createEmergencyRequest = async (req, res, next) => {
  try {
    const hospital = await HospitalModel.findByUserId(req.user.id);

    if (!hospital?.id) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Hospital profile not found");
    }

    const request = await RequestModel.create({
      hospitalId: hospital.id,
      bloodGroup: req.body.bloodGroup,
      componentType: req.body.componentType,
      unitsNeeded: req.body.unitsNeeded,
      urgencyLevel: req.body.urgencyLevel,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      notes: req.body.notes
    });

    const banks = await InventoryModel.findEligibleBanks({
      bloodGroup: request.blood_group,
      componentType: request.component_type,
      unitsNeeded: request.units_needed
    });

    const prioritizedBanks = sortBanksByProximity(
      { latitude: request.latitude, longitude: request.longitude },
      banks
    );

    await LogModel.create({
      requestId: request.id,
      actorUserId: req.user.id,
      actionType: "request_created",
      status: "pending",
      details: `Emergency request created with urgency ${request.urgency_level}`
    });

    req.app.get("io").emit("request:new", { request, prioritizedBanks });
    res.status(StatusCodes.CREATED).json({ request, prioritizedBanks });
  } catch (error) {
    next(error);
  }
};

export const listRequests = async (req, res, next) => {
  try {
    let requests;

    if (req.user.role === "hospital") {
      const hospital = await HospitalModel.findByUserId(req.user.id);

      if (!hospital?.id) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Hospital profile not found");
      }

      requests = await RequestModel.listByHospitalId(hospital.id, req.query);
    } else if (req.user.role === "blood_bank") {
      requests = await RequestModel.listForBankDashboard(req.query);
    } else {
      requests = await RequestModel.list(req.query);
    }

    res.json({ data: requests });
  } catch (error) {
    next(error);
  }
};

export const updateBloodBankRequest = async (req, res, next) => {
  try {
    const bank = await BloodBankModel.findByUserId(req.user.id);

    if (!bank?.id) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Blood bank profile not found");
    }

    const request = await RequestModel.findById(req.params.id);

    if (!request) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Emergency request not found");
    }

    const action = String(req.body.action || "").toLowerCase();

    if (action === "reject") {
      const cancelledRequest = await RequestModel.updateStatus(req.params.id, "cancelled");

      await LogModel.create({
        requestId: cancelledRequest.id,
        actorUserId: req.user.id,
        actionType: "request_rejected",
        status: "cancelled",
        details: `Blood bank ${bank.organization_name} rejected request #${cancelledRequest.id}`
      });

      req.app.get("io").emit("status:updated", { request: cancelledRequest });
      req.app.get("io").emit("status_update", { request: cancelledRequest });
      return res.json({ data: cancelledRequest });
    }

    if (action === "deliver") {
      const assignment = await AssignmentModel.findByRequestId(req.params.id);

      if (!assignment) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Courier assignment not found");
      }

      const inventory = await InventoryModel.releaseDeliveredUnits({
        bankId: bank.id,
        bloodGroup: request.blood_group,
        componentType: request.component_type,
        unitsNeeded: request.units_needed
      });

      const deliveredRequest = await RequestModel.updateStatus(req.params.id, "delivered");
      const deliveredAssignment = await AssignmentModel.updateStatus(assignment.id, "delivered");

      await LogModel.create({
        requestId: deliveredRequest.id,
        assignmentId: deliveredAssignment.id,
        actorUserId: req.user.id,
        actionType: "delivery_completed",
        status: "delivered",
        details: `Delivery completed for request #${deliveredRequest.id}`
      });

      req.app.get("io").emit("delivery_update", {
        request: deliveredRequest,
        assignment: deliveredAssignment,
        inventory
      });
      req.app.get("io").emit("status:updated", {
        request: deliveredRequest,
        assignment: deliveredAssignment
      });
      req.app.get("io").emit("status_update", {
        request: deliveredRequest,
        assignment: deliveredAssignment
      });

      return res.json({ data: { request: deliveredRequest, assignment: deliveredAssignment, inventory } });
    }

    const inventory = await InventoryModel.findOne({
      bankId: bank.id,
      bloodGroup: request.blood_group,
      componentType: request.component_type
    });

    if (!inventory) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Matching blood inventory not found");
    }

    if (Number(inventory.available_units) < Number(request.units_needed)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Insufficient stock to accept request");
    }

    const reservedInventory = await InventoryModel.reserveUnits({
      bankId: bank.id,
      bloodGroup: request.blood_group,
      componentType: request.component_type,
      unitsNeeded: request.units_needed
    });

    const acceptedRequest = await RequestModel.updateStatus(req.params.id, "accepted");
    const courier = await CourierModel.findAvailableCourier();

    if (!courier?.id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No available courier found");
    }

    const assignment = await AssignmentModel.create({
      requestId: acceptedRequest.id,
      courierId: courier.id,
      bankId: bank.id,
      assignedBy: req.user.id
    });

    await LogModel.create({
      requestId: acceptedRequest.id,
      assignmentId: assignment.id,
      actorUserId: req.user.id,
      actionType: "request_accepted",
      status: "accepted",
      details: `Units reserved and courier assigned for request #${acceptedRequest.id}`
    });

    req.app.get("io").emit("status:updated", { request: acceptedRequest, assignment, inventory: reservedInventory });
    req.app.get("io").emit("status_update", { request: acceptedRequest, assignment, inventory: reservedInventory });
    req.app.get("io").emit("assignment:created", { assignment, request: acceptedRequest });
    req.app.get("io").emit("assignment_created", { assignment, request: acceptedRequest });

    res.json({ data: { request: acceptedRequest, assignment, inventory: reservedInventory } });
  } catch (error) {
    next(error);
  }
};
