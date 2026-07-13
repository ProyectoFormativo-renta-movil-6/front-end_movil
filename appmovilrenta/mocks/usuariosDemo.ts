// mocks/usuariosDemo.ts
// Usuarios de prueba para el login mock — se reemplaza por backend real más adelante

export interface UsuarioDemo {
  correo: string;
  contrasena: string;
  id: string;
  rol: string;
}

export const USUARIOS_DEMO: UsuarioDemo[] = [
  {
    correo: "cliente@drivique.com",
    contrasena: "Cliente123*",
    id: "1",
    rol: "cliente",
  },
];

export function buscarUsuarioDemo(
  correo: string,
  contrasena: string,
): UsuarioDemo | null {
  const encontrado = USUARIOS_DEMO.find(
    (u) =>
      u.correo === correo.trim().toLowerCase() && u.contrasena === contrasena,
  );
  return encontrado ?? null;
}