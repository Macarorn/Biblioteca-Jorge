// 1) Conteo de préstamos activos de un usuario
export const COUNT_PRESTAMOS_ACTIVOS = `
  SELECT COUNT(*) AS activos
  FROM prestamos
  WHERE id_usuario = ? AND estado = 'activo'
`;

// 2) Verificar si el usuario tiene vencidos (activo y fecha_vencimiento < hoy)
export const EXISTS_PRESTAMOS_VENCIDOS = `
  SELECT 1
  FROM prestamos
  WHERE id_usuario = ?
    AND estado = 'activo'
    AND fecha_vencimiento IS NOT NULL
    AND fecha_vencimiento < CURDATE()
  LIMIT 1
`;
