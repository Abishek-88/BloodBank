import { query } from "../config/db.js";

const CourierModel = {
  async findByUserId(userId) {
    const rows = await query(
      `SELECT c.id, c.user_id, c.organization_name, c.verification_status, u.name, u.phone
       FROM couriers c
       INNER JOIN users u ON u.id = c.user_id
       WHERE c.user_id = ?
       LIMIT 1`,
      [userId]
    );

    return rows[0] || null;
  },

  async findAvailableCourier() {
    const rows = await query(
      `SELECT c.id, u.name, u.phone
       FROM couriers c
       INNER JOIN users u ON u.id = c.user_id
       WHERE c.verification_status = 'verified'
       ORDER BY c.id ASC
       LIMIT 1`
    );

    return rows[0] || null;
  }
};

export default CourierModel;
