// 1) Listar solicitudes pendientes
export const LIST_SOLICITUDES_PENDIENTES = `
  SELECT
    s.id_solicitud,
    s.fecha_solicitud,
    s.estado,
    s.observacion,
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.documento,
    u.rol,
    l.id_libro,
    l.titulo,
    l.autor,
    l.area,
    l.portada_url
  FROM solicitudes_prestamo s
  JOIN usuarios u ON u.id_usuario = s.id_usuario
  JOIN libros l ON l.id_libro = s.id_libro
  WHERE s.estado = 'pendiente'
  ORDER BY s.fecha_solicitud ASC
`;

// 2) Obtener una solicitud pendiente por id (para aprobar/rechazar)
export const GET_SOLICITUD_PENDIENTE_BY_ID = `
  SELECT
    s.id_solicitud,
    s.id_usuario,
    s.id_libro,
    s.estado,
    u.rol AS rol_usuario
  FROM solicitudes_prestamo s
  JOIN usuarios u ON u.id_usuario = s.id_usuario
  WHERE s.id_solicitud = ? AND s.estado = 'pendiente'
  LIMIT 1
`;

// 3) Tomar un ejemplar disponible (bloqueado en transacción)
export const PICK_EJEMPLAR_DISPONIBLE_FOR_UPDATE = `
  SELECT id_ejemplar
  FROM ejemplares_libro
  WHERE id_libro = ? AND disponibilidad = 'disponible'
  ORDER BY id_ejemplar ASC
  LIMIT 1
  FOR UPDATE
`;

// 4) Marcar ejemplar como prestado
export const UPDATE_EJEMPLAR_A_PRESTADO = `
  UPDATE ejemplares_libro
  SET disponibilidad = 'prestado'
  WHERE id_ejemplar = ?
`;

// 5) Crear préstamo (fecha_devolucion puede ser NULL para profesor)
export const INSERT_PRESTAMO = `
  INSERT INTO prestamos (id_usuario, id_libro, id_ejemplar, fecha_prestamo, fecha_vencimiento, estado)
  VALUES (?, ?, ?, CURDATE(), ?, 'activo')
`;

// 6) Actualizar estado de solicitud
export const UPDATE_SOLICITUD_ESTADO = `
  UPDATE solicitudes_prestamo
  SET estado = ?, observacion = ?
  WHERE id_solicitud = ?
`;
