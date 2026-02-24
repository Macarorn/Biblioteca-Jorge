export const INSERT_LIBRO = `
  INSERT INTO libros (codigo_libro, titulo, autor, area, anio_publicacion, estado, portada_url)
  VALUES (?, ?, ?, ?, ?, COALESCE(?, 'disponible'), ?)
`;

export const UPDATE_LIBRO = `
  UPDATE libros
  SET codigo_libro = COALESCE(?, codigo_libro),
      titulo = COALESCE(?, titulo),
      autor = COALESCE(?, autor),
      area = COALESCE(?, area),
      anio_publicacion = COALESCE(?, anio_publicacion),
      estado = COALESCE(?, estado),
      portada_url = COALESCE(?, portada_url)
  WHERE id_libro = ?
`;

export const DELETE_LIBRO = `DELETE FROM libros WHERE id_libro = ?`;

export const GET_LIBRO_BY_CODIGO = `
  SELECT id_libro FROM libros WHERE codigo_libro = ? LIMIT 1
`;

// Ejemplares
export const INSERT_EJEMPLAR = `
  INSERT INTO ejemplares_libro (id_libro, codigo_inventario, condicion, disponibilidad)
  VALUES (?, ?, COALESCE(?, 'bueno'), COALESCE(?, 'disponible'))
`;

export const COUNT_EJEMPLARES_LIBRO = `
  SELECT COUNT(*) AS total FROM ejemplares_libro WHERE id_libro = ?
`;
