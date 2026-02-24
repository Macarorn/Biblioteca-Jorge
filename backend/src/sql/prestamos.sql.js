// Bibliotecario/Admin: listar préstamos con filtro de estado opcional
/*export const LIST_PRESTAMOS = `
  SELECT
    p.id_prestamo,
    p.fecha_prestamo,
    p.fecha_devolucion,
    p.estado,
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.documento,
    u.rol,
    l.id_libro,
    l.codigo_libro,
    l.titulo,
    l.autor,
    l.area,
    l.portada_url,
    e.id_ejemplar,
    e.codigo_inventario
  FROM prestamos p
  JOIN usuarios u ON u.id_usuario = p.id_usuario
  JOIN libros l ON l.id_libro = p.id_libro
  JOIN ejemplares_libro e ON e.id_ejemplar = p.id_ejemplar
  WHERE (? IS NULL OR ? = '' OR p.estado = ?)
  ORDER BY p.id_prestamo DESC
`;*/

export const LIST_PRESTAMOS = `
  SELECT
    p.id_prestamo,
    p.fecha_prestamo,
    p.fecha_vencimiento,
    p.fecha_devolucion,
    p.estado,
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.documento,
    u.rol,
    l.id_libro,
    l.codigo_libro,
    l.titulo,
    l.autor,
    l.area,
    l.portada_url,
    e.id_ejemplar,
    e.codigo_inventario
  FROM prestamos p
  JOIN usuarios u ON u.id_usuario = p.id_usuario
  JOIN libros l ON l.id_libro = p.id_libro
  JOIN ejemplares_libro e ON e.id_ejemplar = p.id_ejemplar
  WHERE
    (? IS NULL OR ? = '' OR p.estado = ?)
    AND (? = 0 OR (p.estado = 'activo' AND p.fecha_vencimiento < CURDATE()))
  ORDER BY p.id_prestamo DESC
`;

// Usuario: mis préstamos (solo propios)
export const LIST_MIS_PRESTAMOS = `
  SELECT
    p.id_prestamo,
    p.fecha_prestamo,
    p.fecha_devolucion,
    p.estado,
    l.id_libro,
    l.codigo_libro,
    l.titulo,
    l.autor,
    l.area,
    l.portada_url,
    e.id_ejemplar,
    e.codigo_inventario
  FROM prestamos p
  JOIN libros l ON l.id_libro = p.id_libro
  JOIN ejemplares_libro e ON e.id_ejemplar = p.id_ejemplar
  WHERE p.id_usuario = ?
  ORDER BY p.id_prestamo DESC
`;

// Bibliotecario/Admin: devoluciones (con datos del préstamo + usuario + libro)
export const LIST_DEVOLUCIONES = `
  SELECT
    d.id_devolucion,
    d.fecha_devolucion,
    d.observaciones,
    p.id_prestamo,
    p.fecha_prestamo,
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.documento,
    u.rol,
    l.id_libro,
    l.codigo_libro,
    l.titulo,
    e.codigo_inventario
  FROM devoluciones d
  JOIN prestamos p ON p.id_prestamo = d.id_prestamo
  JOIN usuarios u ON u.id_usuario = p.id_usuario
  JOIN libros l ON l.id_libro = p.id_libro
  JOIN ejemplares_libro e ON e.id_ejemplar = p.id_ejemplar
  ORDER BY d.id_devolucion DESC
`;

// Usuario: mis devoluciones
export const LIST_MIS_DEVOLUCIONES = `
  SELECT
    d.id_devolucion,
    d.fecha_devolucion,
    d.observaciones,
    p.id_prestamo,
    p.fecha_prestamo,
    l.id_libro,
    l.codigo_libro,
    l.titulo,
    l.autor,
    l.portada_url,
    e.codigo_inventario
  FROM devoluciones d
  JOIN prestamos p ON p.id_prestamo = d.id_prestamo
  JOIN libros l ON l.id_libro = p.id_libro
  JOIN ejemplares_libro e ON e.id_ejemplar = p.id_ejemplar
  WHERE p.id_usuario = ?
  ORDER BY d.id_devolucion DESC
`;
