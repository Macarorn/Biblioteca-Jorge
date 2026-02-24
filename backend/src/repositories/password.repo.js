import { pool } from "../db/pool.js";
import { CHECK_CURRENT_PASSWORD, UPDATE_PASSWORD } from "../sql/auth.change.sql.js";

export const PasswordRepo = {
  async checkCurrent(documento, currentPassword) {
    const [rows] = await pool.query(CHECK_CURRENT_PASSWORD, [documento, currentPassword]);
    return rows.length > 0;
  },

  async updatePassword(documento, newPassword) {
    const [result] = await pool.query(UPDATE_PASSWORD, [newPassword, documento]);
    return result.affectedRows;
  },
};
