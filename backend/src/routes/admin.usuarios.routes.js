import express from "express";
import AdminUsuariosController from "../controllers/admin.usuarios.controller.js";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = express.Router();
router.post("/", authJwt, requireRole("admin"), AdminUsuariosController.create);

export default router;
