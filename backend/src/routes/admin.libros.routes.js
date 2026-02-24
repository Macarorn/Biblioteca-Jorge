import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireRole } from "../middlewares/requireRole.js";
import { AdminLibrosController } from "../controllers/admin.libros.controller.js";

const router = Router();

router.post("/", authJwt, requireRole("admin"), AdminLibrosController.create);
router.put("/:id", authJwt, requireRole("admin"), AdminLibrosController.update);
router.delete("/:id", authJwt, requireRole("admin"), AdminLibrosController.remove);

export default router;
