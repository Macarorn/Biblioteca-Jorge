export const CHECK_CURRENT_PASSWORD = `
  SELECT 1 AS ok
  FROM login
  WHERE documento = ? AND contrasena = SHA2(?, 256)
  LIMIT 1
`;

export const UPDATE_PASSWORD = `
  UPDATE login
  SET contrasena = SHA2(?, 256)
  WHERE documento = ?
`;
