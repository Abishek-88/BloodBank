import AssignmentModel from "../models/AssignmentModel.js";
import LogModel from "../models/LogModel.js";
import RequestModel from "../models/RequestModel.js";

const requestStatusMap = {
  assigned: "accepted",
  picked_up: "dispatched",
  in_transit: "dispatched",
  delivered: "delivered"
};

export const updateStatus = async (req, res, next) => {
  try {
    const assignment = await AssignmentModel.updateStatus(req.body.assignmentId, req.body.status);
    const request = await RequestModel.updateStatus(
      assignment.request_id,
      requestStatusMap[req.body.status] || "pending"
    );

    await LogModel.create({
      requestId: assignment.request_id,
      assignmentId: assignment.id,
      actorUserId: req.user.id,
      actionType: "status_updated",
      status: req.body.status,
      details: req.body.location || "Live status updated"
    });

    req.app.get("io").emit("status:updated", {
      assignment,
      request,
      location: req.body.location || null,
      timestamp: new Date().toISOString()
    });

    res.json({ assignment, request });
  } catch (error) {
    next(error);
  }
};

export const getRequestLogs = async (req, res, next) => {
  try {
    const logs = await LogModel.listByRequest(req.params.requestId);
    res.json({ data: logs });
  } catch (error) {
    next(error);
  }
};