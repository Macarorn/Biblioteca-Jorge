import { AdminPortadasRepo } from "../repositories/admin.portadas.repo.js";

export const AdminPortadasController = {
  async upload(req, res) {
    const id_libro = Number(req.params.id);
    if (!id_libro) return res.status(400).json({ message: "id inválido" });

    if (!req.file) return res.status(400).json({ message: "Archivo requerido (file)" });

    // La URL pública que servirá Express
    const portada_url = `/uploads/portadas/${req.file.filename}`;

    const affected = await AdminPortadasRepo.setPortada(id_libro, portada_url);
    if (affected === 0) return res.status(404).json({ message: "Libro no encontrado" });

    res.json({ ok: true, id_libro, portada_url });
  },
};
