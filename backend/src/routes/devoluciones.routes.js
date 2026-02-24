import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireAny } from "../middlewares/requireRole.js";
import { DevolucionesController } from "../controllers/devoluciones.controller.js";

const router = Router();

router.post(
  "/prestamos/:id/devolver",
  authJwt,
  requireAny(["bibliotecario", "admin"]),
  DevolucionesController.devolver
);

export default router;
