import { Router } from "express";
import { SolicitudesController } from "../controllers/solicitudes.controller.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = Router();

router.post("/", authJwt, SolicitudesController.crear);
router.get("/me", authJwt, SolicitudesController.listarPorUsuario);

export default router;
