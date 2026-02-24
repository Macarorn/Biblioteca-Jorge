import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRole } from "../middlewares/requireRole.js";
import { uploadMemory } from "../middlewares/uploadMemory.js";
import { AdminImportController } from "../controllers/admin.import.controller.js";

const router = Router();

router.post("/usuarios", authJwt, requireRole("admin"), uploadMemory.single("file"), AdminImportController.importUsuarios);
router.post("/libros", authJwt, requireRole("admin"), uploadMemory.single("file"), AdminImportController.importLibros);

export default router;
