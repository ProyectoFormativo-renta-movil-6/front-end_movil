export interface LoginForm {
  correo: string;
  contrasena: string;
}

export interface RegistroForm {
  nombreCompleto: string;
  nacionalidad: string;
  numeroDocumento: string;
  correo: string;
  confirmarCorreo: string;
  numeroCelular: string;
  fechaNacimiento: string;
  contrasena: string;
  confirmarContrasena: string;
  aceptaTerminos: boolean;
}

export interface OlvideContrasenaForm {
  correo: string;
}

export interface AuthError {
  campo?: string;
  mensaje: string;
}
