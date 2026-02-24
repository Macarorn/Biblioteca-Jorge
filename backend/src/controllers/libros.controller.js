import { pool } from "../db/pool.js";
import { SEARCH_LIBROS_DISPONIBILIDAD, GET_LIBRO_DETALLE } from "../sql/libros.sql.js";

export const LibrosController = {
  async search(req, res) {
    const search = (req.query.search ?? "").trim();
    const [rows] = await pool.query(SEARCH_LIBROS_DISPONIBILIDAD, [
      search || null, search || "", search, search, search
    ]);
    res.json(rows);
  },

  async detalle(req, res) {
    const id = Number(req.params.id);
    const [rows] = await pool.query(GET_LIBRO_DETALLE, [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Libro no encontrado" });
    res.json(rows[0]);
  },
};
