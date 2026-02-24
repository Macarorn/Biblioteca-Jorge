import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireAny } from "../middlewares/requireRole.js";
import { BibliotecarioController } from "../controllers/bibliotecario.controller.js";

const router = Router();

// bibliotecario o admin
router.get("/solicitudes/pendientes", authJwt, requireAny(["bibliotecario", "admin"]), BibliotecarioController.listarPendientes);

router.post("/solicitudes/:id/aprobar", authJwt, requireAny(["bibliotecario", "admin"]), BibliotecarioController.aprobar);

router.post("/solicitudes/:id/rechazar", authJwt, requireAny(["bibliotecario", "admin"]), BibliotecarioController.rechazar);

export default router;
