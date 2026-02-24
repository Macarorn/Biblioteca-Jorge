export const SEARCH_LIBROS_DISPONIBILIDAD = `
  SELECT
    l.id_libro,
    l.codigo_libro,
    l.titulo,
    l.autor,
    l.area,
    l.anio_publicacion,
    l.portada_url,
    COUNT(e.id_ejemplar) AS total_ejemplares,
    SUM(CASE WHEN e.disponibilidad = 'disponible' THEN 1 ELSE 0 END) AS ejemplares_disponibles
  FROM libros l
  LEFT JOIN ejemplares_libro e ON e.id_libro = l.id_libro
  WHERE (? IS NULL OR ? = '' OR
        l.titulo LIKE CONCAT('%', ?, '%') OR
        l.autor  LIKE CONCAT('%', ?, '%') OR
        l.area   LIKE CONCAT('%', ?, '%'))
  GROUP BY
    l.id_libro, l.codigo_libro, l.titulo, l.autor, l.area, l.anio_publicacion, l.portada_url
  ORDER BY l.titulo ASC
`;

export const GET_LIBRO_DETALLE = `
  SELECT
    l.id_libro,
    l.codigo_libro,
    l.titulo,
    l.autor,
    l.area,
    l.anio_publicacion,
    l.portada_url,
    COUNT(e.id_ejemplar) AS total_ejemplares,
    SUM(CASE WHEN e.disponibilidad = 'disponible' THEN 1 ELSE 0 END) AS ejemplares_disponibles,
    SUM(CASE WHEN e.disponibilidad = 'prestado' THEN 1 ELSE 0 END) AS ejemplares_prestados,
    SUM(CASE WHEN e.disponibilidad = 'mantenimiento' THEN 1 ELSE 0 END) AS ejemplares_mantenimiento
  FROM libros l
  LEFT JOIN ejemplares_libro e ON e.id_libro = l.id_libro
  WHERE l.id_libro = ?
  GROUP BY
    l.id_libro, l.codigo_libro, l.titulo, l.autor, l.area, l.anio_publicacion, l.portada_url
`;
