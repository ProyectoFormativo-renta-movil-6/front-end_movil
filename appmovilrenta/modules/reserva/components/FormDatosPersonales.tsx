// modules/reserva/components/FormDatosPersonales.tsx
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { useReservaStore } from "@/store/reservaStore";
import { useUsuarioStore } from "@/store/usuarioStore";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AlertModal } from "../../../components/ui/AlertModal";
import {
  COLOR_MARCA,
  COLORES,
  getPrefijoPorNacionalidad,
  NACIONALIDADES,
  PORCENTAJE_CARGOS_ADMINISTRATIVOS,
  PORCENTAJE_IVA,
  RECARGO_LOGISTICO,
  TIPOS_DOCUMENTO,
} from "../constants/reserva.constants";
import { TipoDocumento } from "../types/reserva.types";
import BarraTotalConfirmar from "./BarraTotalConfirmar";
import CampoSelectorLista from "./CampoSelectorLista";
import ModalReservaRegistrada from "./ModalReservaRegistrada";
import { diasEntre } from "./ResumenReservaModal.piezas";
import TarjetaTerminosCondiciones from "./TarjetaTerminosCondiciones";
import TarjetaVerificacionDocumental from "./TarjetaVerificacionDocumental";

const OPCIONES_TIPO_DOCUMENTO = TIPOS_DOCUMENTO.map((t) => ({
  id: t.id,
  label: t.label,
}));
const OPCIONES_NACIONALIDAD = NACIONALIDADES.map((n) => ({
  id: n.nombre,
  label: n.nombre,
}));

// ── Sincronización nombreCompleto (reserva) ↔ nombres/apellidos (perfil) ──
// reservaStore guarda un solo campo de texto libre; usuarioStore guarda
// nombres y apellidos separados. No hay forma 100% confiable de separar
// un string libre en nombres/apellidos, así que usamos la convención
// colombiana típica (2 nombres + 2 apellidos): se reparten las palabras
// a la mitad, redondeando hacia arriba para "nombres".
//   "Juan Pérez"                 -> nombres: "Juan",        apellidos: "Pérez"
//   "Juan Carlos Pérez Gómez"    -> nombres: "Juan Carlos",  apellidos: "Pérez Gómez"
//   "Juan Carlos Pérez" (3 pal.) -> nombres: "Juan Carlos",  apellidos: "Pérez"
function combinarNombreCompleto(nombres: string, apellidos: string): string {
  return [nombres, apellidos].filter(Boolean).join(" ").trim();
}

function separarNombreCompleto(nombreCompleto: string): {
  nombres: string;
  apellidos: string;
} {
  const partes = nombreCompleto.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return { nombres: "", apellidos: "" };
  if (partes.length === 1) return { nombres: partes[0], apellidos: "" };
  const mitad = Math.ceil(partes.length / 2);
  return {
    nombres: partes.slice(0, mitad).join(" "),
    apellidos: partes.slice(mitad).join(" "),
  };
}

interface Props {
  vehiculo: Vehiculo;
}

export default function FormDatosPersonales({ vehiculo }: Props) {
  const datosPersonales = useReservaStore((s) => s.datosPersonales);
  const actualizarDatosPersonales = useReservaStore(
    (s) => s.actualizarDatosPersonales,
  );
  const fechasLugar = useReservaStore((s) => s.fechasLugar);
  const planes = useReservaStore((s) => s.planes);
  const documentos = useReservaStore((s) => s.documentos);

  const usuarioGlobal = useUsuarioStore((s) => s.usuario);
  const actualizarUsuarioGlobal = useUsuarioStore((s) => s.actualizarUsuario);

  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [alertaFaltantesVisible, setAlertaFaltantesVisible] = useState(false);

  // Precarga al entrar al tab: el correo siempre que exista (viene del
  // login), el resto solo si el usuario ya completó su perfil antes de
  // reservar. Nunca pisa algo que el usuario ya haya escrito aquí.
  useEffect(() => {
    const precarga: Partial<typeof datosPersonales> = {};
    if (
      !datosPersonales.nombreCompleto &&
      (usuarioGlobal.nombres || usuarioGlobal.apellidos)
    ) {
      precarga.nombreCompleto = combinarNombreCompleto(
        usuarioGlobal.nombres,
        usuarioGlobal.apellidos,
      );
    }
    if (!datosPersonales.correo && usuarioGlobal.correo) {
      precarga.correo = usuarioGlobal.correo;
    }
    if (!datosPersonales.nacionalidad && usuarioGlobal.nacionalidad) {
      precarga.nacionalidad = usuarioGlobal.nacionalidad;
    }
    if (!datosPersonales.tipoDocumento && usuarioGlobal.tipoDocumento) {
      precarga.tipoDocumento = usuarioGlobal.tipoDocumento;
    }
    if (!datosPersonales.numeroDocumento && usuarioGlobal.numeroDocumento) {
      precarga.numeroDocumento = usuarioGlobal.numeroDocumento;
    }
    if (!datosPersonales.celular && usuarioGlobal.telefono) {
      precarga.celular = usuarioGlobal.telefono;
    }
    if (Object.keys(precarga).length > 0) {
      actualizarDatosPersonales(precarga);
    }
    // Solo al entrar al tab — no queremos pisar lo que el usuario ya
    // escribió si usuarioGlobal cambia después por otra vía.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Vacío hasta que el usuario elige nacionalidad — no cae a +57 por defecto.
  const prefijoTelefono = getPrefijoPorNacionalidad(
    datosPersonales.nacionalidad || null,
  );
  const hayPrefijo = prefijoTelefono !== "";

  // Todo lo que se pide en este tab tiene que estar diligenciado antes
  // de habilitar el flujo de confirmación (datos + documentos + términos).
  const datosCompletos =
    !!datosPersonales.nombreCompleto.trim() &&
    !!datosPersonales.nacionalidad &&
    !!datosPersonales.correo.trim() &&
    !!datosPersonales.celular.trim() &&
    !!datosPersonales.tipoDocumento &&
    !!datosPersonales.numeroDocumento.trim() &&
    !!documentos.cedulaFrente &&
    !!documentos.licenciaConduccion &&
    !!datosPersonales.terminosAceptados;

  // Mismo cálculo que en ResumenReservaModal.tsx, para que el total
  // que ve el usuario en esta barra sea idéntico al del modal de resumen.
  const total = useMemo(() => {
    const seguros = vehiculo.seguros ?? [];
    const kmLimitado = vehiculo.tarifas?.kmLimitado;
    const kmIlimitado = vehiculo.tarifas?.kmIlimitado;
    const servicios = vehiculo.servicios ?? [];

    const seguroElegido =
      seguros.find((s) => s.nombre === planes.proteccion) ?? null;
    const kmElegido =
      planes.tipoKilometraje === "limitado"
        ? kmLimitado
        : planes.tipoKilometraje === "ilimitado"
          ? kmIlimitado
          : null;

    const dias = diasEntre(
      fechasLugar.fechaRetiro,
      fechasLugar.fechaDevolucion,
    );
    const diarias = vehiculo.precio * dias;
    const proteccion = seguroElegido ? seguroElegido.precio * dias : 0;
    const kilometraje = kmElegido ? kmElegido.precio * dias : 0;
    const servAdic = servicios
      .filter((s) => planes.serviciosSeleccionados.includes(s.nombre))
      .reduce((a, s) => a + s.precio * dias, 0);
    const cargos = Math.round(diarias * PORCENTAJE_CARGOS_ADMINISTRATIVOS);
    const subtotal =
      diarias +
      proteccion +
      kilometraje +
      servAdic +
      cargos +
      RECARGO_LOGISTICO;
    const iva = Math.round(subtotal * PORCENTAJE_IVA);
    return subtotal + iva;
  }, [vehiculo, fechasLugar.fechaRetiro, fechasLugar.fechaDevolucion, planes]);

  const handleConfirmarReserva = () => {
    if (!datosCompletos) {
      setAlertaFaltantesVisible(true);
      return;
    }
    // Aquí luego va la llamada real al backend para crear la reserva
    // como "pendiente" antes de abrir el modal.
    setModalReservaVisible(true);
  };

  const handlePagarWompi = () => {
    setModalReservaVisible(false);
    // Aquí luego va la redirección real al checkout de Wompi.
  };

  return (
    <View>
      {/* Título fuera de la tarjeta, igual que en el resto de los tabs */}
      <Text style={styles.seccionLabel}>Datos personales</Text>

      <View style={styles.card}>
        {/* Subtarjeta: aquí vive todo el contenido (subtítulo, nota y formulario) */}
        <View style={styles.subcard}>
          <Text style={styles.subtitulo}>
            Informa tus datos para que podamos realizar tu reserva.
          </Text>
          <Text style={styles.nota}>
            Los campos marcados con asterisco (*) son obligatorios.
          </Text>

          <View style={styles.separador} />

          <View style={styles.campo}>
            <Text style={styles.inputLabel}>NOMBRE COMPLETO *</Text>
            <TextInput
              style={styles.input}
              value={datosPersonales.nombreCompleto}
              onChangeText={(v) => {
                actualizarDatosPersonales({ nombreCompleto: v });
                const { nombres, apellidos } = separarNombreCompleto(v);
                actualizarUsuarioGlobal({ nombres, apellidos });
              }}
              placeholderTextColor={COLORES.textMuted}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.campo}>
            <CampoSelectorLista
              etiqueta="NACIONALIDAD *"
              valorSeleccionado={datosPersonales.nacionalidad || null}
              opciones={OPCIONES_NACIONALIDAD}
              onSeleccionar={(id) => {
                actualizarDatosPersonales({ nacionalidad: id });
                actualizarUsuarioGlobal({ nacionalidad: id });
              }}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.inputLabel}>CORREO ELECTRÓNICO *</Text>
            <TextInput
              style={styles.input}
              value={datosPersonales.correo}
              onChangeText={(v) => {
                actualizarDatosPersonales({ correo: v });
                actualizarUsuarioGlobal({ correo: v });
              }}
              placeholderTextColor={COLORES.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.inputLabel}>NÚMERO DE CELULAR *</Text>
            <View style={styles.filaCelular}>
              <View
                style={[
                  styles.prefijoBox,
                  !hayPrefijo && styles.prefijoBoxVacio,
                ]}
              >
                <Text
                  style={[
                    styles.prefijoText,
                    !hayPrefijo && styles.prefijoTextVacio,
                  ]}
                >
                  {hayPrefijo ? prefijoTelefono : ""}
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  styles.inputCelular,
                  !hayPrefijo && styles.inputDeshabilitado,
                ]}
                value={datosPersonales.celular}
                onChangeText={(v) => {
                  const digits = v.replace(/\D/g, "");
                  actualizarDatosPersonales({ celular: digits });
                  actualizarUsuarioGlobal({ telefono: digits });
                }}
                keyboardType="phone-pad"
                placeholder={hayPrefijo ? undefined : ""}
                placeholderTextColor={COLORES.textMuted}
                editable={hayPrefijo}
              />
            </View>
          </View>

          <View style={styles.campo}>
            <CampoSelectorLista
              etiqueta="TIPO DE DOCUMENTO *"
              valorSeleccionado={datosPersonales.tipoDocumento}
              opciones={OPCIONES_TIPO_DOCUMENTO}
              onSeleccionar={(id) => {
                actualizarDatosPersonales({
                  tipoDocumento: id as typeof datosPersonales.tipoDocumento,
                });
                actualizarUsuarioGlobal({
                  tipoDocumento: id as TipoDocumento,
                });
              }}
            />
          </View>

          <View style={[styles.campo, { marginBottom: 0 }]}>
            <Text style={styles.inputLabel}>NÚMERO DE DOCUMENTO *</Text>
            <TextInput
              style={styles.input}
              value={datosPersonales.numeroDocumento}
              onChangeText={(v) => {
                actualizarDatosPersonales({ numeroDocumento: v });
                actualizarUsuarioGlobal({ numeroDocumento: v });
              }}
              placeholderTextColor={COLORES.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <TarjetaVerificacionDocumental />
      <TarjetaTerminosCondiciones />

      <BarraTotalConfirmar total={total} onConfirmar={handleConfirmarReserva} />

      <ModalReservaRegistrada
        visible={modalReservaVisible}
        onPagarWompi={handlePagarWompi}
        onCerrar={() => setModalReservaVisible(false)}
      />

      <AlertModal
        visible={alertaFaltantesVisible}
        icono="alert-circle-outline"
        titulo="Faltan datos por completar"
        mensaje="Completa tus datos personales, sube tus documentos y acepta los términos y condiciones antes de confirmar la reserva."
        botones={[]}
        onCerrar={() => setAlertaFaltantesVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  seccionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORES.textMuted,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORES.panelBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  subcard: {
    borderWidth: 1.3,
    borderColor: COLOR_MARCA,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORES.panelBg,
  },
  subtitulo: { fontSize: 12, color: COLORES.textMuted, marginBottom: 8 },
  nota: { fontSize: 10.5, color: COLOR_MARCA, fontStyle: "italic" },
  separador: {
    height: 1,
    backgroundColor: COLORES.panelBorder,
    marginTop: 14,
    marginBottom: 14,
  },

  campo: { marginBottom: 14 },

  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORES.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.3,
    borderColor: COLOR_MARCA,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 12,
    color: COLORES.textPrimary,
    backgroundColor: "#fafbfd",
  },
  inputDeshabilitado: {
    backgroundColor: "#F3F4F6",
    color: COLORES.textMuted,
  },

  filaCelular: { flexDirection: "row", gap: 10 },
  prefijoBox: {
    borderWidth: 1.3,
    borderColor: COLOR_MARCA,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    minWidth: 46,
    alignItems: "center",
    backgroundColor: "#eef2fb",
  },
  prefijoBoxVacio: {
    backgroundColor: "#F3F4F6",
  },
  prefijoText: { fontSize: 12, fontWeight: "700", color: COLOR_MARCA },
  prefijoTextVacio: { color: COLORES.textMuted },
  inputCelular: { flex: 1 },
});
