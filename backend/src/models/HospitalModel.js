import { query } from "../config/db.js";

const HospitalModel = {
  async findByUserId(userId) {
    const rows = await query(
      `SELECT id, user_id, organization_name, verification_status
       FROM hospitals
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );

    return rows[0] || null;
  }
};

export default HospitalModel;
