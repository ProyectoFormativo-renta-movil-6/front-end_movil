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
  ErroresPerfil,
  FormCambiarCorreo,
  FormEditarPerfil,
  UsuarioPerfil,
} from "../types/perfil.types";

// ── Usuario mock — se reemplaza por llamada API REST ─────────────────────────
const USUARIO_MOCK: UsuarioPerfil = {
  id: "1",
  nombre: "Danna Valentina",
  apellido: "Barrios Penagos",
  correo: "danna@correo.com",
  telefono: "3001234567",
  cedula: "1075234567",
  fechaNacimiento: "1998-06-15",
  nacionalidad: "Colombiana",
};

export function usePerfil() {
  const [usuario, setUsuario] = useState<UsuarioPerfil>(USUARIO_MOCK);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);

  // Formulario editar perfil
  const [form, setForm] = useState<FormEditarPerfil>({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
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

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (form.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!form.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    } else if (form.apellido.trim().length < 2) {
      nuevosErrores.apellido = "El apellido debe tener al menos 2 caracteres";
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
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
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
      nombre: usuario.nombre,
      apellido: usuario.apellido,
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
  };
}