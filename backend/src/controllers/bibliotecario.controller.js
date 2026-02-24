import { BibliotecarioRepo } from "../repositories/bibliotecario.repo.js";

export const BibliotecarioController = {
  async listarPendientes(req, res) {
    const rows = await BibliotecarioRepo.listPendientes();
    res.json(rows);
  },

  async aprobar(req, res) {
    const id_solicitud = Number(req.params.id);
    const { observacion, dias_prestamo } = req.body; 
    // fecha_devolucion: "YYYY-MM-DD" o null

    if (!id_solicitud) return res.status(400).json({ message: "id inválido" });

    const result = await BibliotecarioRepo.aprobarSolicitud({
      id_solicitud,
      observacion: observacion ?? null,
      dias_prestamo: dias_prestamo ?? null,
    });

    if (!result.ok) return res.status(result.status).json({ message: result.message });
    res.json(result);
  },

  async rechazar(req, res) {
    const id_solicitud = Number(req.params.id);
    const { observacion } = req.body;

    if (!id_solicitud) return res.status(400).json({ message: "id inválido" });

    const result = await BibliotecarioRepo.rechazarSolicitud({
      id_solicitud,
      observacion: observacion ?? null,
    });

    if (!result.ok) return res.status(result.status).json({ message: result.message });
    res.json(result);
  },
};
