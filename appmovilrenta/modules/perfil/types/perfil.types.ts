export type TipoDocumento = 'CC' | 'TI' | 'Doc. Extranjero' | 'Pasaporte';
export type Nacionalidad = 'Colombia' | 'USA' | 'Francia' | 'Portugal' | 'Brasil';

export interface UsuarioPerfil {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  tipoDocumento: TipoDocumento | '';
  numeroDocumento: string;
  fechaNacimiento: string;
  nacionalidad: Nacionalidad | '';
  perfilCompleto: boolean;
}

export interface FormEditarPerfil {
  nombres: string;
  apellidos: string;
  telefono: string;
}

export interface FormCompletarPerfil {
  nombres: string;
  apellidos: string;
  telefono: string;
  fechaNacimiento: string;
  tipoDocumento: TipoDocumento | '';
  numeroDocumento: string;
  nacionalidad: Nacionalidad | '';
}

export interface FormCambiarCorreo {
  nuevoCorreo: string;
  confirmarCorreo: string;
  contrasenaActual: string;
}

export interface ErroresPerfil {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
}

export interface ErroresCompletarPerfil {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  fechaNacimiento?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nacionalidad?: string;
}

export interface ErroresCambiarCorreo {
  nuevoCorreo?: string;
  confirmarCorreo?: string;
  contrasenaActual?: string;
}