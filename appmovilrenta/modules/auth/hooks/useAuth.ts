import { useState } from 'react';
import { LoginForm, RegistroForm, OlvideContrasenaForm, AuthError } from '../types/auth.types';

function validarCorreo(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
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
      // Credencial de prueba: test@test.com / Test123!
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
    if (!form.nombreCompleto.trim())
      e.push({ campo: 'nombreCompleto', mensaje: 'El nombre completo es obligatorio' });
    if (!form.nacionalidad.trim())
      e.push({ campo: 'nacionalidad', mensaje: 'La nacionalidad es obligatoria' });
    if (!form.numeroDocumento.trim())
      e.push({ campo: 'numeroDocumento', mensaje: 'El número de documento es obligatorio' });
    if (!form.correo.trim())
      e.push({ campo: 'correo', mensaje: 'El correo es obligatorio' });
    else if (!validarCorreo(form.correo))
      e.push({ campo: 'correo', mensaje: 'Formato de correo inválido' });
    if (!form.confirmarCorreo.trim())
      e.push({ campo: 'confirmarCorreo', mensaje: 'Debes confirmar tu correo' });
    else if (form.correo !== form.confirmarCorreo)
      e.push({ campo: 'confirmarCorreo', mensaje: 'Los correos no coinciden' });
    if (!form.numeroCelular.trim())
      e.push({ campo: 'numeroCelular', mensaje: 'El número celular es obligatorio' });
    else if (!/^\d{10}$/.test(form.numeroCelular))
      e.push({ campo: 'numeroCelular', mensaje: 'El celular debe tener 10 dígitos' });
    if (!form.fechaNacimiento)
      e.push({ campo: 'fechaNacimiento', mensaje: 'La fecha de nacimiento es obligatoria' });
    else if (calcularEdad(form.fechaNacimiento) < 18)
      e.push({ campo: 'fechaNacimiento', mensaje: 'Debes tener al menos 18 años' });
    if (!form.contrasena)
      e.push({ campo: 'contrasena', mensaje: 'La contraseña es obligatoria' });
    else if (!validarContrasenaSegura(form.contrasena))
      e.push({ campo: 'contrasena', mensaje: 'Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (@$!%*?&)' });
    if (!form.confirmarContrasena)
      e.push({ campo: 'confirmarContrasena', mensaje: 'Debes confirmar tu contraseña' });
    else if (form.contrasena !== form.confirmarContrasena)
      e.push({ campo: 'confirmarContrasena', mensaje: 'Las contraseñas no coinciden' });
    if (!form.aceptaTerminos)
      e.push({ campo: 'aceptaTerminos', mensaje: 'Debes aceptar los términos y condiciones' });
    setErrores(e);
    return e.length === 0;
  }

  async function registrar(onExito: () => void) {
    if (!validar()) return;
    setCargando(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      onExito();
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