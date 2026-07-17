// mocks/usuariosDemo.ts
// Usuarios de prueba para el login mock — se reemplaza por backend real más adelante

export interface UsuarioDemo {
  correo: string;
  contrasena: string;
  id: string;
  nombres: string;
  apellidos: string;
  rol: string;
}

export const USUARIOS_DEMO: UsuarioDemo[] = [
  {
    correo: "cliente@drivique.com",
    contrasena: "cliente123*",
    id: "1",
    nombres: "Cliente",
    apellidos: "Demo",
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