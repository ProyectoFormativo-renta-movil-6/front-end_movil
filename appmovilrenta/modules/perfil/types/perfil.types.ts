/**
 * RF50 — Editar información del usuario
 * Tipos del módulo de perfil
 */

export interface UsuarioPerfil {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  cedula: string;
  fechaNacimiento: string;
  nacionalidad: string;
}

export interface FormEditarPerfil {
  nombre: string;
  apellido: string;
  telefono: string;
}

export interface FormCambiarCorreo {
  nuevoCorreo: string;
  confirmarCorreo: string;
  contrasenaActual: string;
}

export interface ErroresPerfil {
  nombre?: string;
  apellido?: string;
  telefono?: string;
}

export interface ErroresCambiarCorreo {
  nuevoCorreo?: string;
  confirmarCorreo?: string;
  contrasenaActual?: string;
}