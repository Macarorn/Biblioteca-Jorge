import { PrestamosRepo } from "../repositories/prestamos.repo.js";

export const PrestamosController = {
  // Bibliotecario/Admin
  async listar(req, res) {
    const estado = req.query.estado ?? null;        // activo | devuelto | null
    const soloVencidos = req.query.soloVencidos === "1" ? 1 : 0;

    const rows = await PrestamosRepo.listPrestamos({ estado, soloVencidos });
    res.json(rows);
  },

  // Usuario (estudiante/profesor): sus préstamos
  async misPrestamos(req, res) {
    const id_usuario = req.user.id_usuario;
    const rows = await PrestamosRepo.listMisPrestamos(id_usuario);
    res.json(rows);
  },

  // Bibliotecario/Admin: devoluciones
  async devoluciones(req, res) {
    const rows = await PrestamosRepo.listDevoluciones();
    res.json(rows);
  },

  // Usuario: mis devoluciones
  async misDevoluciones(req, res) {
    const id_usuario = req.user.id_usuario;
    const rows = await PrestamosRepo.listMisDevoluciones(id_usuario);
    res.json(rows);
  },
};
