export const GET_PRESTAMO_ACTIVO_BY_ID_FOR_UPDATE = `
  SELECT p.id_prestamo, p.id_ejemplar, p.estado, p.fecha_devolucion
  FROM prestamos p
  WHERE p.id_prestamo = ? AND p.estado = 'activo'
  LIMIT 1
  FOR UPDATE
`;

export const UPDATE_PRESTAMO_A_DEVUELTO = `
  UPDATE prestamos
  SET estado = 'devuelto',
      fecha_devolucion = CURDATE()
  WHERE id_prestamo = ?
`;

export const INSERT_DEVOLUCION = `
  INSERT INTO devoluciones (id_prestamo, fecha_devolucion, observaciones)
  VALUES (?, CURDATE(), ?)
`;

export const UPDATE_EJEMPLAR_A_DISPONIBLE = `
  UPDATE ejemplares_libro
  SET disponibilidad = 'disponible'
  WHERE id_ejemplar = ?
`;
