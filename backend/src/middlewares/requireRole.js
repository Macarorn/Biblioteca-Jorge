export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });
    if (req.user.rol !== role) return res.status(403).json({ message: "No autorizado" });
    next();
  };
}

export function requireAny(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });
    if (!roles.includes(req.user.rol)) return res.status(403).json({ message: "No autorizado" });
    next();
  };
}
