import { pool } from "../db/pool.js";
import {
  LIST_PRESTAMOS,
  LIST_MIS_PRESTAMOS,
  LIST_DEVOLUCIONES,
  LIST_MIS_DEVOLUCIONES,
} from "../sql/prestamos.sql.js";


export const PrestamosRepo = {
  async listPrestamos({ estado = null, soloVencidos = 0 }) {
    const st = estado ? String(estado).toLowerCase() : null;
    const sv = soloVencidos ? 1 : 0;

    const [rows] = await pool.query(LIST_PRESTAMOS, [st, st, st, sv]);
    return rows;
  },

  async listMisPrestamos(id_usuario) {
    const [rows] = await pool.query(LIST_MIS_PRESTAMOS, [id_usuario]);
    return rows;
  },

  async listDevoluciones() {
    const [rows] = await pool.query(LIST_DEVOLUCIONES);
    return rows;
  },

  async listMisDevoluciones(id_usuario) {
    const [rows] = await pool.query(LIST_MIS_DEVOLUCIONES, [id_usuario]);
    return rows;
  },
};

