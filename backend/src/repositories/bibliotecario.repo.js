import { pool } from "../db/pool.js";
import {
  LIST_SOLICITUDES_PENDIENTES,
  GET_SOLICITUD_PENDIENTE_BY_ID,
  PICK_EJEMPLAR_DISPONIBLE_FOR_UPDATE,
  UPDATE_EJEMPLAR_A_PRESTADO,
  INSERT_PRESTAMO,
  UPDATE_SOLICITUD_ESTADO,
} from "../sql/bibliotecario.sql.js";

import {
  COUNT_PRESTAMOS_ACTIVOS,
  EXISTS_PRESTAMOS_VENCIDOS,
} from "../sql/reglas.sql.js";


export const BibliotecarioRepo = {
  async listPendientes() {
    const [rows] = await pool.query(LIST_SOLICITUDES_PENDIENTES);
    return rows;
  },

  /**
   * Aprueba una solicitud:
   * - valida que siga pendiente
   * - toma un ejemplar disponible (FOR UPDATE)
   * - marca ejemplar prestado
   * - crea prestamo
   * - marca solicitud aprobada
   */
  async aprobarSolicitud({ id_solicitud, observacion = null, dias_prestamo = null }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1) Validar solicitud pendiente + rol del usuario solicitante
      const [solRows] = await conn.query(GET_SOLICITUD_PENDIENTE_BY_ID, [id_solicitud]);
      const sol = solRows[0];
      if (!sol) {
        await conn.rollback();
        return { ok: false, status: 404, message: "Solicitud no existe o no está pendiente" };
      }

      // 2) Reglas de negocio
      // revisar si hay prestamos vencidos
      const [venc] = await conn.query(EXISTS_PRESTAMOS_VENCIDOS, [sol.id_usuario]);
      if (venc.length > 0) {
        await conn.rollback();
        return { ok: false, status: 409, message: "Usuario bloqueado: tiene préstamos vencidos" };
      }

      // Límite de préstamos activos para estudiante (max 2)
      if (sol.rol_usuario === "estudiante") {
        const [cnt] = await conn.query(COUNT_PRESTAMOS_ACTIVOS, [sol.id_usuario]);
        const activos = Number(cnt[0]?.activos ?? 0);
        if (activos >= 2) {
          await conn.rollback();
          return { ok: false, status: 409, message: "Estudiante ya tiene 2 préstamos activos" };
        }
      }

      // 3) Calcular fecha_vencimiento
      const dias = Number(dias_prestamo ?? 10);
      if (!Number.isFinite(dias) || dias <= 0 || dias > 365) {
        await conn.rollback();
        return { ok: false, status: 400, message: "dias_prestamo inválido" };
      }
      const [fvRows] = await conn.query("SELECT DATE_ADD(CURDATE(), INTERVAL ? DAY) AS fv", [dias]);
      const fecha_vencimiento = fvRows[0].fv;

      // 4) Tomar un ejemplar disponible del libro (bloqueado)
      const [ejRows] = await conn.query(PICK_EJEMPLAR_DISPONIBLE_FOR_UPDATE, [sol.id_libro]);
      const ej = ejRows[0];
      if (!ej) {
        await conn.rollback();
        return { ok: false, status: 409, message: "No hay ejemplares disponibles para este libro" };
      }

      // 5) Marcar ejemplar como prestado
      await conn.query(UPDATE_EJEMPLAR_A_PRESTADO, [ej.id_ejemplar]);

      // 6) Crear prestamo
      const [ins] = await conn.query(INSERT_PRESTAMO, [
        sol.id_usuario,
        sol.id_libro,
        ej.id_ejemplar,
        fecha_vencimiento,
      ]);

      const id_prestamo = ins.insertId;

      // 6) Marcar solicitud aprobada
      await conn.query(UPDATE_SOLICITUD_ESTADO, ["aprobada", observacion, id_solicitud]);

      await conn.commit();
      return { ok: true, id_prestamo, id_ejemplar: ej.id_ejemplar };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },

  async rechazarSolicitud({ id_solicitud, observacion = null }) {
    // Rechazar solo si está pendiente (para no re-rechazar)
    const [result] = await pool.query(
      `UPDATE solicitudes_prestamo
       SET estado = 'rechazada', observacion = ?
       WHERE id_solicitud = ? AND estado = 'pendiente'`,
      [observacion, id_solicitud]
    );

    if (result.affectedRows === 0) {
      return { ok: false, status: 404, message: "Solicitud no existe o no está pendiente" };
    }
    return { ok: true };
  },
};
