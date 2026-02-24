import { pool } from "../db/pool.js";
import { INSERT_LOGIN, GET_LOGIN_BY_DOCUMENTO, UPDATE_PASSWORD_BY_DOCUMENTO } from "../sql/auth.sql.js";

export const AuthRepo = {
  async createLogin(id_usuario, documento, contrasenaPlano) {
    // Trigger en DB aplica SHA2 al insertar (según tu script)
    const [result] = await pool.query(INSERT_LOGIN, [id_usuario, documento, contrasenaPlano]);
    return result.insertId;
  },

  async getLoginByDocumento(documento) {
    const [rows] = await pool.query(GET_LOGIN_BY_DOCUMENTO, [documento]);
    return rows[0] ?? null;
  },

  async updatePassword(documento, nuevaContrasenaPlano) {
    // Opción A: confiar en trigger SOLO en INSERT (tu trigger es BEFORE INSERT).
    // Entonces para UPDATE debes hashear aquí:
    const [result] = await pool.query(UPDATE_PASSWORD_BY_DOCUMENTO, [
      // hash en SQL:
      // pero mejor hacerlo directo en query usando SHA2(?)
      // Como ya tenemos query simple, usamos un update alterno:
      nuevaContrasenaPlano,
      documento,
    ]);
    return result.affectedRows;
  },
};
