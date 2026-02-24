import { pool } from "../db/pool.js";
import {
  GET_PRESTAMO_ACTIVO_BY_ID_FOR_UPDATE,
  UPDATE_PRESTAMO_A_DEVUELTO,
  INSERT_DEVOLUCION,
  UPDATE_EJEMPLAR_A_DISPONIBLE,
} from "../sql/devoluciones.sql.js";

export const DevolucionesRepo = {
  async registrarDevolucion({ id_prestamo, observaciones = null }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1) Bloquear y validar préstamo activo
      const [rows] = await conn.query(GET_PRESTAMO_ACTIVO_BY_ID_FOR_UPDATE, [id_prestamo]);
      const prestamo = rows[0];
      if (!prestamo) {
        await conn.rollback();
        return { ok: false, status: 404, message: "Préstamo no existe o no está activo" };
      }

      // 2) Cambiar préstamo a devuelto
      await conn.query(UPDATE_PRESTAMO_A_DEVUELTO, [id_prestamo]);

      // 3) Insertar devolución
      // OJO: devoluciones tiene UNIQUE(id_prestamo), así evitamos duplicados
      await conn.query(INSERT_DEVOLUCION, [id_prestamo, observaciones]);

      // 4) Marcar ejemplar como disponible
      await conn.query(UPDATE_EJEMPLAR_A_DISPONIBLE, [prestamo.id_ejemplar]);

      await conn.commit();
      return { ok: true, id_prestamo, id_ejemplar: prestamo.id_ejemplar };
    } catch (e) {
      await conn.rollback();

      // Si intentan devolver dos veces, puede reventar por UNIQUE (id_prestamo)
      if (String(e?.code) === "ER_DUP_ENTRY") {
        return { ok: false, status: 409, message: "Este préstamo ya tiene devolución registrada" };
      }
      throw e;
    } finally {
      conn.release();
    }
  },
};
