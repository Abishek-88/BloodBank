import { query } from "../config/db.js";

const RequestModel = {
  async create(payload) {
    const result = await query(
      `INSERT INTO emergency_requests
       (hospital_id, blood_group, component_type, units_needed, urgency_level, status, latitude, longitude, notes)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [
        payload.hospitalId,
        payload.bloodGroup,
        payload.componentType,
        payload.unitsNeeded,
        payload.urgencyLevel,
        payload.latitude,
        payload.longitude,
        payload.notes || null
      ]
    );

    return this.findById(result.insertId);
  },

  async findById(id) {
    const rows = await query(
      `SELECT
         er.*,
         h.organization_name AS hospital_name,
         a.id AS assignment_id,
         a.status AS assignment_status,
         cu.name AS courier_name,
         cu.phone AS courier_contact
       FROM emergency_requests er
       INNER JOIN hospitals h ON h.id = er.hospital_id
       LEFT JOIN assignments a ON a.request_id = er.id
       LEFT JOIN couriers c ON c.id = a.courier_id
       LEFT JOIN users cu ON cu.id = c.user_id
       WHERE er.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async list(filters = {}) {
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

    if (filters.bloodGroup) {
      clauses.push("er.blood_group = ?");
      params.push(filters.bloodGroup);
    }

    if (filters.componentType) {
      clauses.push("er.component_type = ?");
      params.push(filters.componentType);
    }

    const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    return query(
      `SELECT
         er.*,
         h.organization_name AS hospital_name,
         a.id AS assignment_id,
         a.status AS assignment_status,
         cu.name AS courier_name,
         cu.phone AS courier_contact
       FROM emergency_requests er
       INNER JOIN hospitals h ON h.id = er.hospital_id
       LEFT JOIN assignments a ON a.request_id = er.id
       LEFT JOIN couriers c ON c.id = a.courier_id
       LEFT JOIN users cu ON cu.id = c.user_id
       ${whereClause}
       ORDER BY FIELD(er.urgency_level, 'critical', 'high', 'medium', 'low'), er.created_at DESC`,
      params
    );
  },

  async listByHospitalId(hospitalId, filters = {}) {
    const clauses = ["er.hospital_id = ?"];
    const params = [hospitalId];

    if (filters.status) {
      clauses.push("er.status = ?");
      params.push(filters.status);
    }

    if (filters.urgencyLevel) {
      clauses.push("er.urgency_level = ?");
      params.push(filters.urgencyLevel);
    }

    if (filters.bloodGroup) {
      clauses.push("er.blood_group = ?");
      params.push(filters.bloodGroup);
    }

    if (filters.componentType) {
      clauses.push("er.component_type = ?");
      params.push(filters.componentType);
    }

    return query(
      `SELECT
         er.*,
         h.organization_name AS hospital_name,
         a.id AS assignment_id,
         a.status AS assignment_status,
         cu.name AS courier_name,
         cu.phone AS courier_contact
       FROM emergency_requests er
       INNER JOIN hospitals h ON h.id = er.hospital_id
       LEFT JOIN assignments a ON a.request_id = er.id
       LEFT JOIN couriers c ON c.id = a.courier_id
       LEFT JOIN users cu ON cu.id = c.user_id
       WHERE ${clauses.join(" AND ")}
       ORDER BY FIELD(er.urgency_level, 'critical', 'high', 'medium', 'low'), er.created_at DESC`,
      params
    );
  },

  async updateStatus(id, status) {
    await query(`UPDATE emergency_requests SET status = ? WHERE id = ?`, [status, id]);
    return this.findById(id);
  },

  async listForBankDashboard(filters = {}) {
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

    if (filters.bloodGroup) {
      clauses.push("er.blood_group = ?");
      params.push(filters.bloodGroup);
    }

    if (filters.componentType) {
      clauses.push("er.component_type = ?");
      params.push(filters.componentType);
    }

    const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    return query(
      `SELECT
         er.*,
         h.organization_name AS hospital_name,
         a.id AS assignment_id,
         a.bank_id,
         a.status AS assignment_status,
         cu.name AS courier_name,
         cu.phone AS courier_contact
       FROM emergency_requests er
       INNER JOIN hospitals h ON h.id = er.hospital_id
       LEFT JOIN assignments a ON a.request_id = er.id
       LEFT JOIN couriers c ON c.id = a.courier_id
       LEFT JOIN users cu ON cu.id = c.user_id
       ${whereClause}
       ORDER BY FIELD(er.urgency_level, 'critical', 'high', 'medium', 'low'), er.created_at DESC`,
      params
    );
  }
};

export default RequestModel;
