import { query } from "../config/db.js";

const AdminModel = {
  async getDashboardOverview() {
    const rows = await query(
      `SELECT
         (SELECT COUNT(*) FROM users) AS total_users,
         (SELECT COUNT(*) FROM hospitals) AS total_hospitals,
         (SELECT COUNT(*) FROM blood_banks) AS total_blood_banks,
         (SELECT COUNT(*) FROM couriers) AS total_couriers,
         (SELECT COUNT(*) FROM emergency_requests) AS total_requests,
         (SELECT COUNT(*) FROM emergency_requests WHERE status IN ('pending', 'accepted', 'dispatched')) AS active_requests,
         (SELECT COUNT(*) FROM assignments WHERE status = 'delivered') AS completed_deliveries`
    );

    return rows[0];
  },

  async getSystemSummary() {
    const rows = await query(
      `SELECT
         (SELECT COUNT(*) FROM emergency_requests) AS total_requests,
         (SELECT COUNT(*) FROM emergency_requests WHERE status = 'delivered') AS delivered_requests,
         (SELECT COUNT(*) FROM assignments WHERE status IN ('assigned', 'picked_up', 'in_transit')) AS active_deliveries,
         (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS active_users`
    );
    return rows[0];
  },

  async getAverageResponseTime() {
    const rows = await query(
      `SELECT AVG(TIMESTAMPDIFF(MINUTE, er.created_at, l.created_at)) AS avg_response_minutes
       FROM emergency_requests er
       INNER JOIN logs l ON l.request_id = er.id
       WHERE l.status = 'accepted'`
    );
    return rows[0];
  },

  async getRecentActivity() {
    return query(
      `SELECT l.id, l.action_type, l.status, l.created_at, u.name AS actor_name
       FROM logs l
       LEFT JOIN users u ON u.id = l.actor_user_id
       ORDER BY l.created_at DESC
       LIMIT 10`
    );
  },

  async listRequests(filters = {}) {
    const clauses = [];
    const params = [];

    if (filters.status) {
      clauses.push("er.status = ?");
      params.push(filters.status);
    }

    if (filters.urgencyLevel) {
      clauses.push("er.urgency_level = ?");
      params.push(filters.urgencyLevel);
    }

    const orderBy =
      filters.sortBy === "created_at"
        ? "er.created_at DESC"
        : "FIELD(er.urgency_level, 'critical', 'high', 'medium', 'low'), er.created_at DESC";

    const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    return query(
      `SELECT er.*, h.organization_name AS hospital_name
       FROM emergency_requests er
       INNER JOIN hospitals h ON h.id = er.hospital_id
       ${whereClause}
       ORDER BY ${orderBy}`,
      params
    );
  },

  async listAssignments() {
    return query(
      `SELECT
         a.id,
         a.request_id,
         a.courier_id,
         a.bank_id,
         a.status,
         er.blood_group,
         er.component_type,
         er.units_needed,
         er.urgency_level,
         cu.name AS courier_name,
         bb.organization_name AS bank_name
       FROM assignments a
       INNER JOIN emergency_requests er ON er.id = a.request_id
       INNER JOIN couriers c ON c.id = a.courier_id
       INNER JOIN users cu ON cu.id = c.user_id
       INNER JOIN blood_banks bb ON bb.id = a.bank_id
       ORDER BY a.created_at DESC`
    );
  },

  async listLogs(filters = {}) {
    const clauses = [];
    const params = [];

    if (filters.requestId) {
      clauses.push("l.request_id = ?");
      params.push(filters.requestId);
    }

    if (filters.userId) {
      clauses.push("l.actor_user_id = ?");
      params.push(filters.userId);
    }

    const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    return query(
      `SELECT
         l.id,
         l.request_id,
         l.assignment_id,
         l.actor_user_id,
         l.action_type,
         l.status,
         l.details,
         l.created_at,
         u.name AS actor_name
       FROM logs l
       LEFT JOIN users u ON u.id = l.actor_user_id
       ${whereClause}
       ORDER BY l.created_at DESC`,
      params
    );
  },

  async getRequestsByUrgency() {
    return query(
      `SELECT urgency_level, COUNT(*) AS total
       FROM emergency_requests
       GROUP BY urgency_level
       ORDER BY FIELD(urgency_level, 'critical', 'high', 'medium', 'low')`
    );
  },

  async getDeliverySuccessRate() {
    const rows = await query(
      `SELECT
         COUNT(*) AS total_requests,
         SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_requests
       FROM emergency_requests`
    );

    return rows[0];
  },

  async updateOrganizationVerification(type, id, verificationStatus) {
    const allowedTables = {
      hospital: "hospitals",
      blood_bank: "blood_banks",
      courier: "couriers"
    };

    const table = allowedTables[type];
    if (!table) {
      return null;
    }

    await query(`UPDATE ${table} SET verification_status = ? WHERE id = ?`, [verificationStatus, id]);
    const rows = await query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id]);
    return rows[0] || null;
  }
};

export default AdminModel;
