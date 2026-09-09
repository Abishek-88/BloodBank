import AssignmentModel from "../models/AssignmentModel.js";
import CourierModel from "../models/CourierModel.js";
import LogModel from "../models/LogModel.js";
import RequestModel from "../models/RequestModel.js";
import ApiError from "../utils/ApiError.js";

const allowedTransitions = {
  assigned: ["picked_up"],
  picked_up: ["in_transit"],
  in_transit: ["delivered"],
  delivered: []
};

const requestStatusMap = {
  picked_up: "dispatched",
  in_transit: "dispatched",
  delivered: "delivered"
};

export const getCourierDeliveries = async (req, res, next) => {
  try {
    const courier = await CourierModel.findByUserId(req.user.id);

    if (!courier?.id) {
      throw new ApiError(404, "Courier profile not found");
    }

    const [deliveries, summary] = await Promise.all([
      AssignmentModel.listByCourier(courier.id),
      AssignmentModel.getCourierDashboardSummary(courier.id)
    ]);

    res.json({ data: deliveries, summary, courier });
  } catch (error) {
    next(error);
  }
};

export const updateCourierStatus = async (req, res, next) => {
  try {
    const courier = await CourierModel.findByUserId(req.user.id);

    if (!courier?.id) {
      throw new ApiError(404, "Courier profile not found");
    }

    const assignment = await AssignmentModel.findById(req.params.id);

    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }

    if (Number(assignment.courier_id) !== Number(courier.id)) {
      throw new ApiError(403, "Assignment does not belong to this courier");
    }

    const nextStatus = String(req.body.status || "").toLowerCase();
    const currentStatus = String(assignment.status || "").toLowerCase();

    if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
      throw new ApiError(400, `Invalid status transition from ${currentStatus} to ${nextStatus}`);
    }

    const updatedAssignment = await AssignmentModel.updateStatus(assignment.id, nextStatus);
    const request = await RequestModel.updateStatus(
      assignment.request_id,
      requestStatusMap[nextStatus] || "accepted"
    );

    await LogModel.create({
      requestId: assignment.request_id,
      assignmentId: assignment.id,
      actorUserId: req.user.id,
      actionType: nextStatus === "delivered" ? "delivery_completed" : "delivery_status_updated",
      status: nextStatus,
      details: req.body.location || `Courier updated status to ${nextStatus}`
    });

    const payload = {
      assignment: updatedAssignment,
      request,
      location: req.body.location || null,
      timestamp: new Date().toISOString()
    };

    req.app.get("io").emit("delivery_update", payload);
    req.app.get("io").emit("status_update", payload);
    req.app.get("io").emit("status:updated", payload);

    res.json({ data: payload });
  } catch (error) {
    next(error);
  }
};
