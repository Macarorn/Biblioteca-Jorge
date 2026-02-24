import { pool } from "../db/pool.js";
import {
  INSERT_LIBRO,
  UPDATE_LIBRO,
  DELETE_LIBRO,
  GET_LIBRO_BY_CODIGO,
  INSERT_EJEMPLAR,
  COUNT_EJEMPLARES_LIBRO,
} from "../sql/admin.libros.sql.js";

export const AdminLibrosRepo = {
  async findByCodigo(codigo_libro) {
    const [rows] = await pool.query(GET_LIBRO_BY_CODIGO, [codigo_libro]);
    return rows[0]?.id_libro ?? null;
  },

  async createLibro(data) {
    const { codigo_libro, titulo, autor, area, anio_publicacion, estado, portada_url } = data;

    const [result] = await pool.query(INSERT_LIBRO, [
      codigo_libro,
      titulo,
      autor,
      area ?? null,
      anio_publicacion ?? null,
      estado ?? null,
      portada_url ?? null,
    ]);

    return result.insertId;
  },

  async updateLibro(id_libro, data) {
    const { codigo_libro, titulo, autor, area, anio_publicacion, estado, portada_url } = data;

    const [result] = await pool.query(UPDATE_LIBRO, [
      codigo_libro ?? null,
      titulo ?? null,
      autor ?? null,
      area ?? null,
      anio_publicacion ?? null,
      estado ?? null,
      portada_url ?? null,
      id_libro,
    ]);

    return result.affectedRows;
  },

  async deleteLibro(id_libro) {
    const [result] = await pool.query(DELETE_LIBRO, [id_libro]);
    return result.affectedRows;
  },

  async addEjemplar(id_libro, { codigo_inventario, condicion, disponibilidad }) {
    const [result] = await pool.query(INSERT_EJEMPLAR, [
      id_libro,
      codigo_inventario,
      condicion ?? null,
      disponibilidad ?? null,
    ]);
    return result.insertId;
  },

  async countEjemplares(id_libro) {
    const [rows] = await pool.query(COUNT_EJEMPLARES_LIBRO, [id_libro]);
    return Number(rows[0]?.total ?? 0);
  },
};
