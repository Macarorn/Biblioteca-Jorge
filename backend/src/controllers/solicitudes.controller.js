import { pool } from "../db/pool.js";
import { EXISTS_SOLICITUD_PENDIENTE, INSERT_SOLICITUD, COUNT_EJEMPLARES_DISPONIBLES } from "../sql/solicitudes.sql.js";

export const SolicitudesController = {
  async crear(req, res) {
    const id_usuario = req.user.id_usuario;
    const rol = req.user.rol;
    const { id_libro } = req.body;

    if (!["estudiante", "profesor"].includes(rol)) {
      return res.status(403).json({ message: "Solo estudiantes o profesores pueden solicitar" });
    }
    if (!id_libro) return res.status(400).json({ message: "id_libro es requerido" });

    // Evitar duplicados pendientes
    const [dup] = await pool.query(EXISTS_SOLICITUD_PENDIENTE, [id_usuario, id_libro]);
    if (dup.length > 0) return res.status(409).json({ message: "Ya tienes una solicitud pendiente para este libro" });

    // (Opcional) validar disponibilidad real
    const [countRows] = await pool.query(COUNT_EJEMPLARES_DISPONIBLES, [id_libro]);
    const disponibles = Number(countRows[0]?.disponibles ?? 0);
    if (disponibles <= 0) return res.status(409).json({ message: "No hay ejemplares disponibles" });

    const [result] = await pool.query(INSERT_SOLICITUD, [id_usuario, id_libro]);
    res.status(201).json({ id_solicitud: result.insertId });
  },
};
