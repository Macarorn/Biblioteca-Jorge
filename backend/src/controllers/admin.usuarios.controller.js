import AdminUsuariosRepo from "../repositories/admin.usuarios.repo.js";

const AdminUsuariosController = {
  async create(req, res) {
    try {
      const { nombre, apellido, documento, telefono, correo, rol, contrasena } =
        req.body;
      if (!nombre || !apellido || !documento || !rol || !contrasena) {
        return res.status(400).json({ error: "Faltan campos obligatorios." });
      }
      const usuario = await AdminUsuariosRepo.create({
        nombre,
        apellido,
        documento,
        telefono,
        correo,
        rol,
        contrasena,
      });
      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default AdminUsuariosController;
