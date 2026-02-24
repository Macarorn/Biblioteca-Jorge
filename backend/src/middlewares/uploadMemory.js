import multer from "multer";

// Sube archivos a memoria (req.file.buffer). Ideal para Excel (no guardas en disco).
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB (ajusta si quieres)
  },
  fileFilter: (req, file, cb) => {
    // Acepta .xlsx (Postman a veces manda mimetype genérico, por eso validamos también por nombre)
    const isXlsx =
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.originalname.toLowerCase().endsWith(".xlsx");

    if (!isXlsx) {
      return cb(new Error("Solo se permiten archivos .xlsx"));
    }
    cb(null, true);
  },
});
