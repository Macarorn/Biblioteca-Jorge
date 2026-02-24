import jwt from "jsonwebtoken";
import { AuthRepo } from "../repositories/auth.repo.js";
import { pool } from "../db/pool.js";

export const AuthController = {
  async login(req, res) {
    const { documento, contrasena } = req.body;
    if (!documento || !contrasena) return res.status(400).json({ message: "documento y contrasena requeridos" });

    const row = await AuthRepo.getLoginByDocumento(documento);
    if (!row) return res.status(401).json({ message: "Credenciales inválidas" });

    // Validar SHA2 en MySQL:
    const [check] = await pool.query(
      "SELECT 1 AS ok WHERE ? = ? AND ? = ?",
      [1, 1, 1, 1]
    );

    // Comparación real:
    const [match] = await pool.query(
      "SELECT 1 AS ok WHERE ? = (SELECT contrasena FROM login WHERE documento = ?) ",
      [ /* este no sirve sin hash */ 0, documento ]
    );

    // Mejor: comparar hash directamente:
    const [rows] = await pool.query(
      "SELECT 1 AS ok FROM login WHERE documento = ? AND contrasena = SHA2(?, 256) LIMIT 1",
      [documento, contrasena]
    );
    if (rows.length === 0) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id_usuario: row.id_usuario, rol: row.rol, documento: row.documento },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id_usuario: row.id_usuario, rol: row.rol, nombre: row.nombre, apellido: row.apellido, documento: row.documento },
    });
  },
};
