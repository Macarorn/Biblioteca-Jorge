import multer from "multer";
import path from "path";
import fs from "fs";

const dir = path.join(process.cwd(), "uploads", "portadas");
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),

  filename: (req, file, cb) => {
    const id = req.params.id || "libro";
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    const unique = Date.now();
    cb(null, `libro_${id}_${unique}${safeExt}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  const okMime = allowed.includes(file.mimetype);
  const okExt = [".jpg", ".jpeg", ".png", ".webp"].some((e) =>
    file.originalname.toLowerCase().endsWith(e)
  );

  if (!okMime && !okExt) return cb(new Error("Solo imágenes JPG/PNG/WEBP"));
  cb(null, true);
}

export const uploadPortada = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});
