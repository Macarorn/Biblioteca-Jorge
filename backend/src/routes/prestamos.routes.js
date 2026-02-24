import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireAny } from "../middlewares/requireRole.js";
import { PrestamosController } from "../controllers/prestamos.controller.js";

const router = Router();

// Usuario (estudiante/profesor/admin/bibliotecario): ver sus préstamos/devoluciones
router.get("/me/prestamos", authJwt, PrestamosController.misPrestamos);
router.get("/me/devoluciones", authJwt, PrestamosController.misDevoluciones);

// Bibliotecario/Admin: ver todos los préstamos y devoluciones
router.get("/bibliotecario/prestamos", authJwt, requireAny(["bibliotecario", "admin"]), PrestamosController.listar);
// filtro: /bibliotecario/prestamos?estado=activo  ó  ?estado=devuelto

router.get("/bibliotecario/devoluciones", authJwt, requireAny(["bibliotecario", "admin"]), PrestamosController.devoluciones);

export default router;
