import { query } from "../config/db.js";

const profileTables = {
  hospital: "hospitals",
  blood_bank: "blood_banks",
  courier: "couriers"
};

const ProfileModel = {
  async createProfile(role, payload) {
    const table = profileTables[role];
    if (!table) return null;

    const result = await query(
      `INSERT INTO ${table} (user_id, organization_name, address, latitude, longitude, service_radius_km, verification_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.userId,
        payload.organizationName,
        payload.address,
        payload.latitude,
        payload.longitude,
        payload.serviceRadiusKm || 25,
        payload.verificationStatus || "verified"
      ]
    );

    return { id: result.insertId };
  }
};

export default ProfileModel;