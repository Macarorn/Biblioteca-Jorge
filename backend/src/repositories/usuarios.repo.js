import { pool } from "../db/pool.js";
import { INSERT_USUARIO,
  GET_USUARIO_BY_DOCUMENTO,
  GET_USUARIO_BY_ID,
  GET_MI_PERFIL,
  UPDATE_MI_PERFIL,
  UPDATE_USUARIO_ADMIN,
  LIST_BUSCAR_USUARIOS
} from "../sql/usuarios.sql.js";

export const UsuariosRepo = {
  async createUser(nombre, apellido, documento, telefono, correo, rol = "estudiante") {
    const [result] = await pool.query(INSERT_USUARIO, [nombre, apellido, documento, telefono, correo, rol]);
    return result.insertId; // MySQL: insertId
  },

  async findByDocumento(documento) {
    const [rows] = await pool.query(GET_USUARIO_BY_DOCUMENTO, [documento]);
    return rows[0] ?? null;
  },

  async findById(id_usuario) {
    const [rows] = await pool.query(GET_USUARIO_BY_ID, [id_usuario]);
    return rows[0] ?? null;
  },
};

export const PerfilRepo = {
  async getMiPerfil(id_usuario) {
    const [rows] = await pool.query(GET_MI_PERFIL, [id_usuario]);
    return rows[0] ?? null;
  },

  async updateMiPerfil(id_usuario, { nombre, apellido, correo, telefono }) {
    const [result] = await pool.query(UPDATE_MI_PERFIL, [
      nombre ?? null,
      apellido ?? null,
      correo ?? null,
      telefono ?? null,
      id_usuario,
    ]);
    return result.affectedRows;
  },

  async adminUpdateUsuario(id_usuario, { nombre, apellido, correo, telefono, rol }) {
    const [result] = await pool.query(UPDATE_USUARIO_ADMIN, [
      nombre ?? null,
      apellido ?? null,
      correo ?? null,
      telefono ?? null,
      rol ?? null,
      id_usuario,
    ]);
    return result.affectedRows;
  },

  async listBuscarUsuarios(q) {
    const search = (q ?? "").trim();
    const [rows] = await pool.query(LIST_BUSCAR_USUARIOS, [
      search || null,
      search || "",
      search,
      search,
      search,
      search.toLowerCase(), // para rol exacto si escriben "admin"
    ]);
    return rows;
  },
};

