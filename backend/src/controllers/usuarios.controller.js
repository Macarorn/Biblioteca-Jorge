import { PerfilRepo } from "../repositories/usuarios.repo.js";

export const UsuariosController = {
  // Usuario autenticado: ver su perfil
  async me(req, res) {
    const perfil = await PerfilRepo.getMiPerfil(req.user.id_usuario);
    if (!perfil) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(perfil);
  },

  // Usuario autenticado: editar su perfil (sin rol, sin documento, sin password)
  async updateMe(req, res) {
    const allowed = (({ nombre, apellido, correo, telefono }) => ({ nombre, apellido, correo, telefono }))(req.body);

    const affected = await PerfilRepo.updateMiPerfil(req.user.id_usuario, allowed);
    if (affected === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ ok: true });
  },

  // Admin: editar cualquier usuario (sin password)
  async adminUpdate(req, res) {
    const id_usuario = Number(req.params.id);
    if (!id_usuario) return res.status(400).json({ message: "id inválido" });

    // Validar rol si lo mandan
    if (req.body.rol) {
      const r = String(req.body.rol).toLowerCase();
      const valid = ["estudiante", "profesor", "bibliotecario", "admin"].includes(r);
      if (!valid) return res.status(400).json({ message: "rol inválido" });
      req.body.rol = r;
    }

    const allowed = (({ nombre, apellido, correo, telefono, rol }) => ({ nombre, apellido, correo, telefono, rol }))(req.body);

    const affected = await PerfilRepo.adminUpdateUsuario(id_usuario, allowed);
    if (affected === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ ok: true });
  },

  // Bibliotecario/Admin: listar/buscar
  async list(req, res) {
    const q = req.query.q ?? "";
    const rows = await PerfilRepo.listBuscarUsuarios(q);
    res.json(rows);
  },
};
