import { pool } from "../db/pool.js";

const AdminUsuariosRepo = {
  async create({
    nombre,
    apellido,
    documento,
    telefono,
    correo,
    rol,
    contrasena,
  }) {

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query(
        "INSERT INTO usuarios (nombre, apellido, documento, telefono, correo, rol) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, apellido, documento, telefono, correo, rol],
      );
      const id_usuario = result.insertId;
      await conn.query(
        "INSERT INTO login (id_usuario, documento, contrasena) VALUES (?, ?, ?)",
        [id_usuario, documento, contrasena],
      );
      await conn.commit();
      return { id_usuario, nombre, apellido, documento, telefono, correo, rol };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
};

export default AdminUsuariosRepo;
