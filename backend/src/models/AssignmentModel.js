import { query } from "../config/db.js";

const AssignmentModel = {
  async create({ requestId, courierId, bankId, assignedBy }) {
    const result = await query(
      `INSERT INTO assignments (request_id, courier_id, bank_id, assigned_by, status)
       VALUES (?, ?, ?, ?, 'assigned')`,
      [requestId, courierId, bankId, assignedBy]
    );

    return this.findById(result.insertId);
  },

  async findById(id) {
    const rows = await query(
      `SELECT a.*, u.name AS courier_name, bb.organization_name AS bank_name
       FROM assignments a
       INNER JOIN couriers c ON c.id = a.courier_id
       INNER JOIN users u ON u.id = c.user_id
       INNER JOIN blood_banks bb ON bb.id = a.bank_id
       WHERE a.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async listByCourier(courierId) {
    return query(
      `SELECT
         a.*,
         er.blood_group,
         er.component_type,
         er.units_needed,
         er.urgency_level,
         er.status AS request_status,
         bb.organization_name AS bank_name,
         cu.name AS courier_name,
         cu.phone AS courier_contact
       FROM assignments a
       INNER JOIN emergency_requests er ON er.id = a.request_id
       INNER JOIN blood_banks bb ON bb.id = a.bank_id
       INNER JOIN couriers c ON c.id = a.courier_id
       INNER JOIN users cu ON cu.id = c.user_id
       WHERE a.courier_id = ?
       ORDER BY a.created_at DESC`,
      [courierId]
    );
  },

  async updateStatus(id, status) {
    await query(`UPDATE assignments SET status = ? WHERE id = ?`, [status, id]);
    return this.findById(id);
  },

  async findByRequestId(requestId) {
    const rows = await query(
      `SELECT a.*, u.name AS courier_name, u.phone AS courier_contact, bb.organization_name AS bank_name
       FROM assignments a
       INNER JOIN couriers c ON c.id = a.courier_id
       INNER JOIN users u ON u.id = c.user_id
       INNER JOIN blood_banks bb ON bb.id = a.bank_id
       WHERE a.request_id = ?
       ORDER BY a.id DESC
       LIMIT 1`,
      [requestId]
    );

    return rows[0] || null;
  },

  async listByBank(bankId, filters = {}) {
    const clauses = ["a.bank_id = ?"];
    const params = [bankId];

    if (filters.status) {
      clauses.push("a.status = ?");
      params.push(filters.status);
    }

    return query(
      `SELECT
         a.*,
         er.blood_group,
         er.component_type,
         er.units_needed,
         er.urgency_level,
         er.status AS request_status,
         cu.name AS courier_name,
         cu.phone AS courier_contact
       FROM assignments a
       INNER JOIN emergency_requests er ON er.id = a.request_id
       INNER JOIN couriers c ON c.id = a.courier_id
       INNER JOIN users cu ON cu.id = c.user_id
       WHERE ${clauses.join(" AND ")}
       ORDER BY a.created_at DESC`,
      params
    );
  },

  async getCourierDashboardSummary(courierId) {
    const rows = await query(
      `SELECT
         (SELECT COUNT(*) FROM assignments WHERE courier_id = ?) AS total_assigned,
         (SELECT COUNT(*) FROM assignments
          WHERE courier_id = ? AND status IN ('assigned', 'picked_up', 'in_transit')) AS active_deliveries,
         (SELECT COUNT(*) FROM assignments
          WHERE courier_id = ? AND status = 'delivered') AS completed_deliveries`,
      [courierId, courierId, courierId]
    );

    return rows[0] || {
      total_assigned: 0,
      active_deliveries: 0,
      completed_deliveries: 0
    };
  }
};

export default AssignmentModel;
