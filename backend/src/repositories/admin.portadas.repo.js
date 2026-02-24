import { pool } from "../db/pool.js";
import { UPDATE_LIBRO_PORTADA } from "../sql/admin.portadas.sql.js";

export const AdminPortadasRepo = {
  async setPortada(id_libro, portada_url) {
    const [result] = await pool.query(UPDATE_LIBRO_PORTADA, [portada_url, id_libro]);
    return result.affectedRows;
  },
};
