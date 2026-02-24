import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRole } from "../middlewares/requireRole.js";
import { uploadPortada } from "../middlewares/uploadPortada.js";
import { AdminPortadasController } from "../controllers/admin.portadas.controller.js";

const router = Router();

router.post(
  "/:id/portada",
  authJwt,
  requireRole("admin"),
  uploadPortada.single("file"),
  AdminPortadasController.upload
);

export default router;
