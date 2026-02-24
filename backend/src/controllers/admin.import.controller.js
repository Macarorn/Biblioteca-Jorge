import ExcelJS from "exceljs";
import { UsuariosRepo } from "../repositories/usuarios.repo.js";
import { AuthRepo } from "../repositories/auth.repo.js";
import { AdminLibrosRepo } from "../repositories/admin.libros.repo.js";

function norm(v) {
  return String(v ?? "").trim();
}

export const AdminImportController = {
  async importUsuarios(req, res) {
    if (!req.file?.buffer) return res.status(400).json({ message: "Archivo requerido (file)" });

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(req.file.buffer);
    const ws = wb.worksheets[0];
    if (!ws) return res.status(400).json({ message: "Excel sin hojas" });

    const out = { inserted: 0, skipped: 0, errors: [] };

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const documento = norm(row.getCell(1).value);
      const nombre = norm(row.getCell(2).value);
      const apellido = norm(row.getCell(3).value);
      const telefono = norm(row.getCell(4).value);
      const correo = norm(row.getCell(5).value);
      const rolRaw = norm(row.getCell(6).value).toLowerCase();

      const rol = ["estudiante", "profesor", "bibliotecario", "admin"].includes(rolRaw)
        ? rolRaw
        : "estudiante";

      if (!documento || !nombre || !apellido) {
        out.skipped++;
        out.errors.push({ row: r, message: "Campos obligatorios faltantes" });
        continue;
      }

      try {
        const exists = await UsuariosRepo.findByDocumento(documento);
        if (exists) { out.skipped++; continue; }

        const id_usuario = await UsuariosRepo.createUser(nombre, apellido, documento, telefono, correo, rol);
        await AuthRepo.createLogin(id_usuario, documento, documento); // doc/doc

        out.inserted++;
      } catch (e) {
        out.skipped++;
        out.errors.push({ row: r, message: e?.message ?? "Error" });
      }
    }

    res.json(out);
  },

  async importLibros(req, res) {
    if (!req.file?.buffer) return res.status(400).json({ message: "Archivo requerido (file)" });

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(req.file.buffer);
    const ws = wb.worksheets[0];
    if (!ws) return res.status(400).json({ message: "Excel sin hojas" });

    const out = { inserted: 0, skipped: 0, errors: [] };

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);

      const codigo_libro = norm(row.getCell(1).value);
      const titulo = norm(row.getCell(2).value);
      const autor = norm(row.getCell(3).value);
      const area = norm(row.getCell(4).value) || null;

      // anio puede venir como número o texto
      const anioCell = row.getCell(5).value;
      const anio_publicacion = anioCell ? Number(String(anioCell).toString().slice(0, 4)) : null;

      const portada_url = norm(row.getCell(6).value) || null;
      const cantidad = Number(norm(row.getCell(7).value) || 0);

      if (!codigo_libro || !titulo || !autor) {
        out.skipped++;
        out.errors.push({ row: r, message: "codigo_libro/titulo/autor obligatorios" });
        continue;
      }

      try {
        const exists = await AdminLibrosRepo.findByCodigo(codigo_libro);
        if (exists) { out.skipped++; continue; }

        const id_libro = await AdminLibrosRepo.createLibro({
          codigo_libro, titulo, autor, area, anio_publicacion, portada_url
        });

        if (cantidad > 0) {
          for (let i = 1; i <= cantidad; i++) {
            const codigo_inventario = `${codigo_libro}-${String(i).padStart(3, "0")}`;
            await AdminLibrosRepo.addEjemplar(id_libro, { codigo_inventario });
          }
        }

        out.inserted++;
      } catch (e) {
        out.skipped++;
        out.errors.push({ row: r, message: e?.message ?? "Error" });
      }
    }

    res.json(out);
  },
};
