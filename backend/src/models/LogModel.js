import { query } from "../config/db.js";

const LogModel = {
  async create({ requestId, assignmentId, actorUserId, actionType, status, details }) {
    await query(
      `INSERT INTO logs (request_id, assignment_id, actor_user_id, action_type, status, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [requestId || null, assignmentId || null, actorUserId || null, actionType, status, details || null]
    );
  },

  async listByRequest(requestId) {
    return query(
      `SELECT l.*, u.name AS actor_name
       FROM logs l
       LEFT JOIN users u ON u.id = l.actor_user_id
       WHERE l.request_id = ?
       ORDER BY l.created_at DESC`,
      [requestId]
    );
  }
};

export default LogModel;