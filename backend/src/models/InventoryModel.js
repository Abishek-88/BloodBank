import { query } from "../config/db.js";

const InventoryModel = {
  async listByBank(bankId) {
    return query(
      `SELECT bi.*, bb.organization_name AS bank_name,
              (bi.units_available - bi.reserved_units) AS available_units
       FROM blood_inventory bi
       INNER JOIN blood_banks bb ON bb.id = bi.bank_id
       WHERE bi.bank_id = ?
       ORDER BY bi.blood_group ASC`,
      [bankId]
    );
  },

  async upsert({ bankId, bloodGroup, componentType, unitsAvailable, reservedUnits = 0 }) {
    await query(
      `INSERT INTO blood_inventory (bank_id, blood_group, component_type, units_available, reserved_units)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE units_available = VALUES(units_available), reserved_units = VALUES(reserved_units)`,
      [bankId, bloodGroup, componentType, unitsAvailable, reservedUnits]
    );

    const rows = await query(
      `SELECT * FROM blood_inventory WHERE bank_id = ? AND blood_group = ? AND component_type = ? LIMIT 1`,
      [bankId, bloodGroup, componentType]
    );

    return rows[0] || null;
  },

  async findEligibleBanks({ bloodGroup, componentType, unitsNeeded }) {
    return query(
      `SELECT bb.id, bb.organization_name, bb.latitude, bb.longitude, bi.units_available,
              (bi.units_available - bi.reserved_units) AS available_units
       FROM blood_banks bb
       INNER JOIN blood_inventory bi ON bi.bank_id = bb.id
       WHERE bb.verification_status = 'verified'
         AND bi.blood_group = ?
         AND bi.component_type = ?
         AND (bi.units_available - bi.reserved_units) >= ?`,
      [bloodGroup, componentType, unitsNeeded]
    );
  },

  async findOne({ bankId, bloodGroup, componentType }) {
    const rows = await query(
      `SELECT *,
              (units_available - reserved_units) AS available_units
       FROM blood_inventory
       WHERE bank_id = ? AND blood_group = ? AND component_type = ?
       LIMIT 1`,
      [bankId, bloodGroup, componentType]
    );

    return rows[0] || null;
  },

  async reserveUnits({ bankId, bloodGroup, componentType, unitsNeeded }) {
    await query(
      `UPDATE blood_inventory
       SET reserved_units = reserved_units + ?
       WHERE bank_id = ? AND blood_group = ? AND component_type = ?`,
      [unitsNeeded, bankId, bloodGroup, componentType]
    );

    return this.findOne({ bankId, bloodGroup, componentType });
  },

  async releaseDeliveredUnits({ bankId, bloodGroup, componentType, unitsNeeded }) {
    await query(
      `UPDATE blood_inventory
       SET units_available = GREATEST(units_available - ?, 0),
           reserved_units = GREATEST(reserved_units - ?, 0)
       WHERE bank_id = ? AND blood_group = ? AND component_type = ?`,
      [unitsNeeded, unitsNeeded, bankId, bloodGroup, componentType]
    );

    return this.findOne({ bankId, bloodGroup, componentType });
  }
};

export default InventoryModel;
