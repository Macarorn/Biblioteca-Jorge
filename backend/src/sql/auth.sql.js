export const INSERT_LOGIN = `
  INSERT INTO login (id_usuario, documento, contrasena)
  VALUES (?, ?, ?)
`;

export const GET_LOGIN_BY_DOCUMENTO = `
  SELECT l.id_login, l.id_usuario, l.documento, l.contrasena,
         u.rol, u.nombre, u.apellido
  FROM login l
  JOIN usuarios u ON u.id_usuario = l.id_usuario
  WHERE l.documento = ?
`;

export const UPDATE_PASSWORD_BY_DOCUMENTO = `
  UPDATE login
  SET contrasena = SHA2(?, 256)
  WHERE documento = ?
`;
