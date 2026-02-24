import { DevolucionesRepo } from "../repositories/devoluciones.repo.js";

export const DevolucionesController = {
  async devolver(req, res) {
    const id_prestamo = Number(req.params.id);
    const { observaciones } = req.body;

    if (!id_prestamo) return res.status(400).json({ message: "id_prestamo inválido" });

    const result = await DevolucionesRepo.registrarDevolucion({
      id_prestamo,
      observaciones: observaciones ?? null,
    });

    if (!result.ok) return res.status(result.status).json({ message: result.message });
    res.json(result);
  },
};
