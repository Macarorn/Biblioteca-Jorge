export const INSERT_USUARIO = `
  INSERT INTO usuarios (nombre, apellido, documento, telefono, correo, rol)
  VALUES (?, ?, ?, ?, ?, COALESCE(?, 'estudiante'))
`;

export const GET_USUARIO_BY_DOCUMENTO = `
  SELECT id_usuario, nombre, apellido, documento, telefono, correo, rol
  FROM usuarios
  WHERE documento = ?
`;

export const GET_USUARIO_BY_ID = `
  SELECT id_usuario, nombre, apellido, documento, telefono, correo, rol
  FROM usuarios
  WHERE id_usuario = ?
`;

// Ver perfil propio
export const GET_MI_PERFIL = `
  SELECT id_usuario, nombre, apellido, documento, rol, correo, telefono
  FROM usuarios
  WHERE id_usuario = ?
`;

// Usuario edita su perfil (NO documento, NO rol)
export const UPDATE_MI_PERFIL = `
  UPDATE usuarios
  SET nombre = COALESCE(?, nombre),
      apellido = COALESCE(?, apellido),
      correo = COALESCE(?, correo),
      telefono = COALESCE(?, telefono)
  WHERE id_usuario = ?
`;

// Admin edita cualquier usuario (NO password; documento opcionalmente NO)
export const UPDATE_USUARIO_ADMIN = `
  UPDATE usuarios
  SET nombre = COALESCE(?, nombre),
      apellido = COALESCE(?, apellido),
      correo = COALESCE(?, correo),
      telefono = COALESCE(?, telefono),
      rol = COALESCE(?, rol)
  WHERE id_usuario = ?
`;

// Listar/buscar usuarios (bibliotecario/admin)
export const LIST_BUSCAR_USUARIOS = `
  SELECT id_usuario, nombre, apellido, documento, rol, correo, telefono
  FROM usuarios
  WHERE (? IS NULL OR ? = '' OR
        documento LIKE CONCAT('%', ?, '%') OR
        nombre LIKE CONCAT('%', ?, '%') OR
        apellido LIKE CONCAT('%', ?, '%') OR
        rol = ?)
  ORDER BY id_usuario DESC
  LIMIT 200
`;

