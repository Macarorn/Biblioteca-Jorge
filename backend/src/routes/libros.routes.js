import { Router } from "express";
import { LibrosController } from "../controllers/libros.controller.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = Router();

// autenticado para ver catálogo (como pide el ejercicio)
router.get("/", authJwt, LibrosController.search);
router.get("/:id", authJwt, LibrosController.detalle);

export default router;
