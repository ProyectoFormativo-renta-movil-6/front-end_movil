/**
 * RF50 — Editar información del usuario
 * Hook principal del módulo de perfil
 * RF50.1: Modificar nombre de usuario
 * RF50.2: Modificar correo electrónico
 * RF50.3: Agregar o modificar teléfono
 * RF50.4: Validar contraseña actual
 * RF50.5: Guardar cambios validados
 * RF50.6: Cancelar edición perfil
 */

import { useState } from "react";
import {
  ErroresCambiarCorreo,
  ErroresCompletarPerfil,
  ErroresPerfil,
  FormCambiarCorreo,
  FormCompletarPerfil,
  FormEditarPerfil,
  UsuarioPerfil,
} from "../types/perfil.types";

const USUARIO_MOCK: UsuarioPerfil = {
  id: "1",
  nombres: "",
  apellidos: "",
  correo: "danna@correo.com",
  telefono: "",
  tipoDocumento: "",
  numeroDocumento: "",
  fechaNacimiento: "",
  nacionalidad: "",
  perfilCompleto: false,
};

export function usePerfil() {
  const [usuario, setUsuario] = useState<UsuarioPerfil>(USUARIO_MOCK);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);

  // Formulario editar perfil
  const [form, setForm] = useState<FormEditarPerfil>({
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    telefono: usuario.telefono,
  });

  // Formulario cambiar correo
  const [formCorreo, setFormCorreo] = useState<FormCambiarCorreo>({
    nuevoCorreo: "",
    confirmarCorreo: "",
    contrasenaActual: "",
  });

  const [errores, setErrores] = useState<ErroresPerfil>({});
  const [erroresCorreo, setErroresCorreo] = useState<ErroresCambiarCorreo>({});

  // ── Actualizar campo del formulario ────────────────────────────────────────
  const actualizarCampo = (campo: keyof FormEditarPerfil, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  const actualizarCampoCorreo = (campo: keyof FormCambiarCorreo, valor: string) => {
    setFormCorreo((prev) => ({ ...prev, [campo]: valor }));
    setErroresCorreo((prev) => ({ ...prev, [campo]: undefined }));
  };

  // ── Validaciones ───────────────────────────────────────────────────────────
  const validarPerfil = (): boolean => {
    const nuevosErrores: ErroresPerfil = {};

    if (!form.nombres.trim()) {
      nuevosErrores.nombres = "Los nombres son obligatorios";
    } else if (form.nombres.trim().length < 2) {
      nuevosErrores.nombres = "Los nombres deben tener al menos 2 caracteres";
    }

    if (!form.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios";
    } else if (form.apellidos.trim().length < 2) {
      nuevosErrores.apellidos = "Los apellidos deben tener al menos 2 caracteres";
    }

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (!/^3\d{9}$/.test(form.telefono.trim())) {
      nuevosErrores.telefono = "Debe tener 10 dígitos y empezar con 3";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const validarCambioCorreo = (): boolean => {
    const nuevosErrores: ErroresCambiarCorreo = {};

    if (!formCorreo.nuevoCorreo.trim()) {
      nuevosErrores.nuevoCorreo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formCorreo.nuevoCorreo)) {
      nuevosErrores.nuevoCorreo = "Formato de correo inválido";
    } else if (formCorreo.nuevoCorreo === usuario.correo) {
      nuevosErrores.nuevoCorreo = "El nuevo correo debe ser diferente al actual";
    }

    if (!formCorreo.confirmarCorreo.trim()) {
      nuevosErrores.confirmarCorreo = "Confirme el correo";
    } else if (formCorreo.nuevoCorreo !== formCorreo.confirmarCorreo) {
      nuevosErrores.confirmarCorreo = "Los correos no coinciden";
    }

    if (!formCorreo.contrasenaActual.trim()) {
      nuevosErrores.contrasenaActual = "La contraseña actual es obligatoria";
    }

    setErroresCorreo(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ── Guardar cambios perfil ─────────────────────────────────────────────────
  const guardarCambios = (
    onExito: () => void,
    onError: () => void
  ) => {
    if (!validarPerfil()) {
      onError();
      return;
    }

    setCargando(true);
    // Simula llamada API — se reemplaza por servicio real
    setTimeout(() => {
      setUsuario((prev) => ({
        ...prev,
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        telefono: form.telefono.trim(),
      }));
      setEditando(false);
      setCargando(false);
      onExito();
    }, 1000);
  };

  // ── Cancelar edición ───────────────────────────────────────────────────────
  const cancelarEdicion = () => {
    setForm({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
    });
    setErrores({});
    setEditando(false);
  };

  // ── Guardar cambio de correo ───────────────────────────────────────────────
  const guardarCambioCorreo = (
    onExito: () => void,
    onError: (msg: string) => void
  ) => {
    if (!validarCambioCorreo()) return;

    setCargando(true);
    // Simula llamada API — se reemplaza por servicio real
    setTimeout(() => {
      // Simula verificación de contraseña
      if (formCorreo.contrasenaActual !== "Password123@") {
        setCargando(false);
        onError("Contraseña incorrecta");
        return;
      }
      setUsuario((prev) => ({ ...prev, correo: formCorreo.nuevoCorreo }));
      setFormCorreo({ nuevoCorreo: "", confirmarCorreo: "", contrasenaActual: "" });
      setMostrarModalCorreo(false);
      setCargando(false);
      onExito();
    }, 1000);
  };

  const cerrarModalCorreo = () => {
    setFormCorreo({ nuevoCorreo: "", confirmarCorreo: "", contrasenaActual: "" });
    setErroresCorreo({});
    setMostrarModalCorreo(false);
  };

  const marcarPerfilCompleto = () => {
    setUsuario(prev => ({ ...prev, perfilCompleto: true }));
  };

  return {
    usuario,
    editando,
    setEditando,
    cargando,
    form,
    formCorreo,
    errores,
    erroresCorreo,
    actualizarCampo,
    actualizarCampoCorreo,
    guardarCambios,
    cancelarEdicion,
    mostrarModalCorreo,
    setMostrarModalCorreo,
    guardarCambioCorreo,
    cerrarModalCorreo,
    marcarPerfilCompleto,
  };
}

export function useCompletarPerfil() {
  const [form, setForm] = useState<FormCompletarPerfil>({
    nombres: "",
    apellidos: "",
    telefono: "",
    fechaNacimiento: "",
    tipoDocumento: "",
    numeroDocumento: "",
    nacionalidad: "",
  });
  const [errores, setErrores] = useState<ErroresCompletarPerfil>({});
  const [cargando, setCargando] = useState(false);

  const actualizarCampo = (campo: keyof FormCompletarPerfil, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErrores(prev => ({ ...prev, [campo]: undefined }));
  };

  const validar = (): boolean => {
    const e: ErroresCompletarPerfil = {};

    if (!form.nombres.trim())
      e.nombres = "Los nombres son obligatorios";
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(form.nombres))
      e.nombres = "Solo letras y espacios";

    if (!form.apellidos.trim())
      e.apellidos = "Los apellidos son obligatorios";
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(form.apellidos))
      e.apellidos = "Solo letras y espacios";

    if (!form.telefono.trim())
      e.telefono = "El teléfono es obligatorio";
    else if (!/^3\d{9}$/.test(form.telefono.trim()))
      e.telefono = "Debe tener 10 dígitos y empezar con 3";

    if (!form.fechaNacimiento)
      e.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.fechaNacimiento))
      e.fechaNacimiento = "Formato: YYYY-MM-DD";

    if (!form.tipoDocumento)
      e.tipoDocumento = "Selecciona el tipo de documento";

    if (!form.numeroDocumento.trim())
      e.numeroDocumento = "El número de documento es obligatorio";
    else if (!/^\d{6,10}$/.test(form.numeroDocumento))
      e.numeroDocumento = "Entre 6 y 10 dígitos numéricos";

    if (!form.nacionalidad)
      e.nacionalidad = "Selecciona tu nacionalidad";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = (onExito: () => void, onError: () => void) => {
    if (!validar()) { onError(); return; }
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      onExito();
    }, 1000);
  };

  return { form, errores, cargando, actualizarCampo, guardar };
}