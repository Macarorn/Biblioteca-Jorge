import { AdminLibrosRepo } from "../repositories/admin.libros.repo.js";

export const AdminLibrosController = {
  async create(req, res) {
    const { codigo_libro, titulo, autor, area, anio_publicacion, estado, portada_url, cantidad_ejemplares } = req.body;

    if (!codigo_libro || !titulo || !autor) {
      return res.status(400).json({ message: "codigo_libro, titulo y autor son obligatorios" });
    }

    const exists = await AdminLibrosRepo.findByCodigo(codigo_libro);
    if (exists) return res.status(409).json({ message: "codigo_libro ya existe" });

    const id_libro = await AdminLibrosRepo.createLibro({
      codigo_libro, titulo, autor, area, anio_publicacion, estado, portada_url
    });

    // Crear ejemplares si se indica cantidad
    const qty = Number(cantidad_ejemplares ?? 0);
    if (qty > 0) {
      for (let i = 1; i <= qty; i++) {
        const codigo_inventario = `${codigo_libro}-${String(i).padStart(3, "0")}`;
        await AdminLibrosRepo.addEjemplar(id_libro, { codigo_inventario });
      }
    }

    res.status(201).json({ id_libro });
  },

  async update(req, res) {
    const id_libro = Number(req.params.id);
    if (!id_libro) return res.status(400).json({ message: "id inválido" });

    const affected = await AdminLibrosRepo.updateLibro(id_libro, req.body);
    if (affected === 0) return res.status(404).json({ message: "Libro no encontrado" });

    res.json({ ok: true });
  },

  async remove(req, res) {
    const id_libro = Number(req.params.id);
    if (!id_libro) return res.status(400).json({ message: "id inválido" });

    const affected = await AdminLibrosRepo.deleteLibro(id_libro);
    if (affected === 0) return res.status(404).json({ message: "Libro no encontrado" });

    res.json({ ok: true });
  },
};
