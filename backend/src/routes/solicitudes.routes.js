import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { SolicitudesController } from "../controllers/solicitudes.controller.js";

const router = Router();

router.post("/", authJwt, SolicitudesController.crear);

export default router;
