import { query } from "../config/db.js";

const UserModel = {
  async create({ name, email, password, role, phone }) {
    const result = await query(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`,
      [name, email, password, role, phone || null]
    );

    return this.findById(result.insertId);
  },

  async findByEmail(email) {
    const rows = await query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await query(
      `SELECT id, name, email, role, phone, is_active, created_at FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async list({ page = 1, limit = 10, role }) {
    const offset = (page - 1) * limit;
    const filters = [];
    const params = [];

    if (role) {
      filters.push("role = ?");
      params.push(role);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    return query(
      `SELECT id, name, email, role, phone, is_active, created_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
  },

  async updateStatus(id, isActive) {
    await query(`UPDATE users SET is_active = ? WHERE id = ?`, [isActive, id]);
    return this.findById(id);
  },

  async deleteById(id) {
    await query(`DELETE FROM users WHERE id = ?`, [id]);
    return true;
  }
};

export default UserModel;
