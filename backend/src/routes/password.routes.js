import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { PasswordController } from "../controllers/password.controller.js";

const router = Router();

router.post("/change-password", authJwt, PasswordController.changePassword);

export default router;
