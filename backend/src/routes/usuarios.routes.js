import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireAny, requireRole } from "../middlewares/requireRole.js";
import { UsuariosController } from "../controllers/usuarios.controller.js";

const router = Router();

// Perfil propio
router.get("/me", authJwt, UsuariosController.me);
router.put("/me", authJwt, UsuariosController.updateMe);

// Admin edita cualquier usuario
router.put("/:id", authJwt, requireRole("admin"), UsuariosController.adminUpdate);

// Bibliotecario/Admin listan y buscan usuarios
router.get("/", authJwt, requireAny(["bibliotecario", "admin"]), UsuariosController.list);

export default router;
