import { hashSync, compareSync } from 'bcrypt';

export function encriptarContraseña(contraseña) { 
  const saltRounds = 6; 
  return hashSync(contraseña, saltRounds);
}

export function compararContraseña(contraseña, hash) {
  return compareSync(contraseña, hash);
}