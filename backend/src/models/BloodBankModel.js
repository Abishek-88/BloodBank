import { query } from "../config/db.js";

const BloodBankModel = {
  async findByUserId(userId) {
    const rows = await query(
      `SELECT id, user_id, organization_name, verification_status
       FROM blood_banks
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );

    return rows[0] || null;
  },

  async getDashboardSummary(bankId) {
    const rows = await query(
      `SELECT
         (SELECT COUNT(*) FROM emergency_requests er
          INNER JOIN assignments a ON a.request_id = er.id
          WHERE a.bank_id = ?) AS total_requests,
         (SELECT COUNT(*) FROM emergency_requests er
          INNER JOIN assignments a ON a.request_id = er.id
          WHERE a.bank_id = ? AND er.status = 'accepted') AS accepted_requests,
         (SELECT COUNT(*) FROM assignments
          WHERE bank_id = ? AND status IN ('assigned', 'picked_up', 'in_transit')) AS active_deliveries,
         (SELECT COALESCE(SUM(units_available - reserved_units), 0)
          FROM blood_inventory
          WHERE bank_id = ?) AS available_units`,
      [bankId, bankId, bankId, bankId]
    );

    return rows[0] || {
      total_requests: 0,
      accepted_requests: 0,
      active_deliveries: 0,
      available_units: 0
    };
  }
};

export default BloodBankModel;
