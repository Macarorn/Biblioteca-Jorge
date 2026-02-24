import { PasswordRepo } from "../repositories/password.repo.js";

function validateNewPassword(pw) {
  if (typeof pw !== "string") return "Nueva contraseña inválida";
  if (pw.length < 8) return "La nueva contraseña debe tener mínimo 8 caracteres";
  if (pw.length > 72) return "La nueva contraseña es demasiado larga";
  return null;
}

export const PasswordController = {
  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword y newPassword son requeridos" });
    }

    const err = validateNewPassword(newPassword);
    if (err) return res.status(400).json({ message: err });

    // documento viene del token (no se puede cambiar)
    const documento = req.user.documento;

    const ok = await PasswordRepo.checkCurrent(documento, currentPassword);
    if (!ok) return res.status(401).json({ message: "Contraseña actual incorrecta" });

    // Evitar “cambiar a la misma” (opcional, pero útil)
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "La nueva contraseña debe ser diferente a la actual" });
    }

    const updated = await PasswordRepo.updatePassword(documento, newPassword);
    if (updated === 0) return res.status(404).json({ message: "Login no encontrado" });

    res.json({ ok: true });
  },
};
