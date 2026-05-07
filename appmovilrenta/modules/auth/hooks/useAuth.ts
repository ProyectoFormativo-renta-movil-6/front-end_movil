import { useState } from 'react';
import { LoginForm, RegistroForm, OlvideContrasenaForm, AuthError } from '../types/auth.types';

function validarCorreo(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && !correo.includes(' ');
}

function validarContrasenaSegura(contrasena: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(contrasena);
}

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const mes = hoy.getMonth() - nac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function esFechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(fecha);
  return d instanceof Date && !isNaN(d.getTime());
}

function validarNombreCompleto(nombre: string): string | null {
  if (!nombre.trim())
    return 'El nombre completo es obligatorio';
  if (nombre.trim().length < 5)
    return 'El nombre debe tener al menos 5 caracteres';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre))
    return 'El nombre solo puede contener letras y espacios, sin números ni símbolos';
  const palabras = nombre.trim().split(/\s+/);
  if (palabras.length < 2)
    return 'Ingresa tu nombre completo con al menos un apellido';
  return null;
}

function validarNacionalidad(nacionalidad: string): string | null {
  if (!nacionalidad.trim())
    return 'La nacionalidad es obligatoria';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nacionalidad))
    return 'La nacionalidad solo puede contener letras, sin números ni símbolos';
  if (nacionalidad.trim().length < 4)
    return 'Ingresa una nacionalidad válida';
  return null;
}

function validarDocumento(doc: string): string | null {
  if (!doc.trim())
    return 'El número de documento es obligatorio';
  if (!/^\d+$/.test(doc))
    return 'El documento solo puede contener números, sin letras ni símbolos';
  if (doc.length < 6 || doc.length > 10)
    return 'El documento debe tener entre 6 y 10 dígitos';
  return null;
}

// ── useLogin (RF43) ──────────────────────────────────────────────────────────

export function useLogin() {
  const [form, setForm] = useState<LoginForm>({ correo: '', contrasena: '' });
  const [errores, setErrores] = useState<AuthError[]>([]);
  const [cargando, setCargando] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  function actualizarCampo(campo: keyof LoginForm, valor: string) {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErrores(prev => prev.filter(e => e.campo !== campo));
  }

  function validar(): boolean {
    const e: AuthError[] = [];
    if (!form.correo.trim())
      e.push({ campo: 'correo', mensaje: 'El correo es obligatorio' });
    else if (!validarCorreo(form.correo))
      e.push({ campo: 'correo', mensaje: 'Formato de correo inválido' });
    if (!form.contrasena.trim())
      e.push({ campo: 'contrasena', mensaje: 'La contraseña es obligatoria' });
    setErrores(e);
    return e.length === 0;
  }

  async function iniciarSesion(onExito: () => void) {
    if (bloqueado) {
      setErrores([{ mensaje: 'Cuenta bloqueada tras 3 intentos fallidos. Intenta más tarde.' }]);
      return;
    }
    if (!validar()) return;

    setCargando(true);
    try {
      await new Promise(r => setTimeout(r, 1000));

      if (form.correo === 'test@test.com' && form.contrasena === 'Test123!') {
        setIntentosFallidos(0);
        onExito();
      } else {
        const intentos = intentosFallidos + 1;
        setIntentosFallidos(intentos);
        if (intentos >= 3) {
          setBloqueado(true);
          setErrores([{ mensaje: 'Cuenta bloqueada tras 3 intentos fallidos.' }]);
        } else {
          setErrores([{ mensaje: `Correo o contraseña incorrectos. Intento ${intentos}/3` }]);
        }
      }
    } finally {
      setCargando(false);
    }
  }

  return { form, errores, cargando, bloqueado, actualizarCampo, iniciarSesion };
}

// ── useRegistro (RF42) ───────────────────────────────────────────────────────

export function useRegistro() {
  const [form, setForm] = useState<RegistroForm>({
    nombreCompleto: '',
    nacionalidad: '',
    numeroDocumento: '',
    correo: '',
    confirmarCorreo: '',
    numeroCelular: '',
    fechaNacimiento: '',
    contrasena: '',
    confirmarContrasena: '',
    aceptaTerminos: false,
  });
  const [errores, setErrores] = useState<AuthError[]>([]);
  const [cargando, setCargando] = useState(false);

  function actualizarCampo(campo: keyof RegistroForm, valor: string | boolean) {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErrores(prev => prev.filter(e => e.campo !== campo));
  }

  function validar(): boolean {
    const e: AuthError[] = [];

    // Nombre completo
    const errNombre = validarNombreCompleto(form.nombreCompleto);
    if (errNombre) e.push({ campo: 'nombreCompleto', mensaje: errNombre });

    // Nacionalidad
    const errNacionalidad = validarNacionalidad(form.nacionalidad);
    if (errNacionalidad) e.push({ campo: 'nacionalidad', mensaje: errNacionalidad });

    // Documento
    const errDoc = validarDocumento(form.numeroDocumento);
    if (errDoc) e.push({ campo: 'numeroDocumento', mensaje: errDoc });

    // Correo
    if (!form.correo.trim())
      e.push({ campo: 'correo', mensaje: 'El correo es obligatorio' });
    else if (!validarCorreo(form.correo))
      e.push({ campo: 'correo', mensaje: 'Formato de correo inválido, no debe contener espacios' });

    // Confirmar correo
    if (!form.confirmarCorreo.trim())
      e.push({ campo: 'confirmarCorreo', mensaje: 'Debes confirmar tu correo' });
    else if (form.correo !== form.confirmarCorreo)
      e.push({ campo: 'confirmarCorreo', mensaje: 'Los correos no coinciden' });

    // Celular
    if (!form.numeroCelular.trim())
      e.push({ campo: 'numeroCelular', mensaje: 'El número celular es obligatorio' });
    else if (!/^\d{10}$/.test(form.numeroCelular))
      e.push({ campo: 'numeroCelular', mensaje: 'El celular debe tener exactamente 10 dígitos numéricos' });
    else if (!form.numeroCelular.startsWith('3'))
      e.push({ campo: 'numeroCelular', mensaje: 'El celular colombiano debe comenzar con 3' });

    // Fecha de nacimiento
    if (!form.fechaNacimiento)
      e.push({ campo: 'fechaNacimiento', mensaje: 'La fecha de nacimiento es obligatoria' });
    else if (!esFechaValida(form.fechaNacimiento))
      e.push({ campo: 'fechaNacimiento', mensaje: 'La fecha ingresada no es válida (usa el formato YYYY-MM-DD)' });
    else if (calcularEdad(form.fechaNacimiento) < 18)
      e.push({ campo: 'fechaNacimiento', mensaje: 'Debes tener al menos 18 años para registrarte' });
    else if (calcularEdad(form.fechaNacimiento) > 100)
      e.push({ campo: 'fechaNacimiento', mensaje: 'Ingresa una fecha de nacimiento válida' });

    // Contraseña
    if (!form.contrasena)
      e.push({ campo: 'contrasena', mensaje: 'La contraseña es obligatoria' });
    else if (!validarContrasenaSegura(form.contrasena))
      e.push({ campo: 'contrasena', mensaje: 'Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (@$!%*?&)' });

    // Confirmar contraseña
    if (!form.confirmarContrasena)
      e.push({ campo: 'confirmarContrasena', mensaje: 'Debes confirmar tu contraseña' });
    else if (form.contrasena !== form.confirmarContrasena)
      e.push({ campo: 'confirmarContrasena', mensaje: 'Las contraseñas no coinciden' });

    // Términos
    if (!form.aceptaTerminos)
      e.push({ campo: 'aceptaTerminos', mensaje: 'Debes aceptar los términos y condiciones' });

    setErrores(e);
    return e.length === 0;
  }

  async function registrar(onExito: () => void, onError: () => void) {
    if (!validar()) {
      onError();
      return;
    }
    setCargando(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      onExito();
    } catch (error) {
      onError();
    } finally {
      setCargando(false);
    }
  }

  function getError(campo: string): string | undefined {
    return errores.find(e => e.campo === campo)?.mensaje;
  }

  return { form, errores, cargando, actualizarCampo, registrar, getError };
}

// ── useOlvideContrasena (RF43) ────────────────────────────────────────────────

export function useOlvideContrasena() {
  const [form, setForm] = useState<OlvideContrasenaForm>({ correo: '' });
  const [errores, setErrores] = useState<AuthError[]>([]);
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function actualizarCorreo(valor: string) {
    setForm({ correo: valor });
    setErrores([]);
  }

  function validar(): boolean {
    const e: AuthError[] = [];
    if (!form.correo.trim())
      e.push({ campo: 'correo', mensaje: 'El correo es obligatorio' });
    else if (!validarCorreo(form.correo))
      e.push({ campo: 'correo', mensaje: 'Formato de correo inválido' });
    setErrores(e);
    return e.length === 0;
  }

  async function enviarEnlace() {
    if (!validar()) return;
    setCargando(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setEnviado(true);
    } finally {
      setCargando(false);
    }
  }

  return { form, errores, cargando, enviado, actualizarCorreo, enviarEnlace };
}