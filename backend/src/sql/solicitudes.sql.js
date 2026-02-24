export const INSERT_SOLICITUD = `
  INSERT INTO solicitudes_prestamo (id_usuario, id_libro, estado)
  VALUES (?, ?, 'pendiente')
`;

export const EXISTS_SOLICITUD_PENDIENTE = `
  SELECT 1
  FROM solicitudes_prestamo
  WHERE id_usuario = ? AND id_libro = ? AND estado = 'pendiente'
  LIMIT 1
`;

export const COUNT_EJEMPLARES_DISPONIBLES = `
  SELECT COUNT(*) AS disponibles
  FROM ejemplares_libro
  WHERE id_libro = ? AND disponibilidad = 'disponible'
`;
