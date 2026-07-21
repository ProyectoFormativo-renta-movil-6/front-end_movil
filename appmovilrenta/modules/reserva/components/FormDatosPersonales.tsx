// modules/reserva/components/FormDatosPersonales.tsx
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { useReservaStore } from "@/store/reservaStore";
import { useUsuarioStore } from "@/store/usuarioStore";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AlertModal } from "../../../components/ui/AlertModal";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import {
  COLOR_MARCA,
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
  const c = useTemaColores();
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

  const primaryAccent = c.oscuro ? "#60A5FA" : COLOR_MARCA;
  const brandBg = c.oscuro ? "#3B82F6" : COLOR_MARCA;

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
  }, []);

  const prefijoTelefono = getPrefijoPorNacionalidad(
    datosPersonales.nacionalidad || null,
  );
  const hayPrefijo = prefijoTelefono !== "";

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
    setModalReservaVisible(true);
  };

  const handlePagarWompi = () => {
    setModalReservaVisible(false);
  };

  return (
    <View>
      <Text style={[styles.seccionLabel, { color: c.textMuted }]}>Datos personales</Text>

      <View style={[styles.card, { backgroundColor: c.bgCard }]}>
        <View style={[styles.subcard, { backgroundColor: c.bgCard, borderColor: brandBg }]}>
          <Text style={[styles.subtitulo, { color: c.textMuted }]}>
            Informa tus datos para que podamos realizar tu reserva.
          </Text>
          <Text style={[styles.nota, { color: primaryAccent }]}>
            Los campos marcados con asterisco (*) son obligatorios.
          </Text>

          <View style={[styles.separador, { backgroundColor: c.border }]} />

          <View style={styles.campo}>
            <Text style={[styles.inputLabel, { color: c.textSecondary }]}>NOMBRE COMPLETO *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: c.bgInput, borderColor: brandBg, color: c.textPrimary }]}
              value={datosPersonales.nombreCompleto}
              onChangeText={(v) => {
                actualizarDatosPersonales({ nombreCompleto: v });
                const { nombres, apellidos } = separarNombreCompleto(v);
                actualizarUsuarioGlobal({ nombres, apellidos });
              }}
              placeholderTextColor={c.textMuted}
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
            <Text style={[styles.inputLabel, { color: c.textSecondary }]}>CORREO ELECTRÓNICO *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: c.bgInput, borderColor: brandBg, color: c.textPrimary }]}
              value={datosPersonales.correo}
              onChangeText={(v) => {
                actualizarDatosPersonales({ correo: v });
                actualizarUsuarioGlobal({ correo: v });
              }}
              placeholderTextColor={c.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.campo}>
            <Text style={[styles.inputLabel, { color: c.textSecondary }]}>NÚMERO DE CELULAR *</Text>
            <View style={styles.filaCelular}>
              <View
                style={[
                  styles.prefijoBox,
                  { backgroundColor: c.primaryBg, borderColor: brandBg },
                  !hayPrefijo && { backgroundColor: c.oscuro ? "#1F2937" : "#F3F4F6" },
                ]}
              >
                <Text
                  style={[
                    styles.prefijoText,
                    { color: primaryAccent },
                    !hayPrefijo && { color: c.textMuted },
                  ]}
                >
                  {hayPrefijo ? prefijoTelefono : ""}
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  styles.inputCelular,
                  { backgroundColor: c.bgInput, borderColor: brandBg, color: c.textPrimary },
                  !hayPrefijo && { backgroundColor: c.oscuro ? "#1F2937" : "#F3F4F6", color: c.textMuted },
                ]}
                value={datosPersonales.celular}
                onChangeText={(v) => {
                  const digits = v.replace(/\D/g, "");
                  actualizarDatosPersonales({ celular: digits });
                  actualizarUsuarioGlobal({ telefono: digits });
                }}
                keyboardType="phone-pad"
                placeholder={hayPrefijo ? undefined : ""}
                placeholderTextColor={c.textMuted}
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
            <Text style={[styles.inputLabel, { color: c.textSecondary }]}>NÚMERO DE DOCUMENTO *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: c.bgInput, borderColor: brandBg, color: c.textPrimary }]}
              value={datosPersonales.numeroDocumento}
              onChangeText={(v) => {
                actualizarDatosPersonales({ numeroDocumento: v });
                actualizarUsuarioGlobal({ numeroDocumento: v });
              }}
              placeholderTextColor={c.textMuted}
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
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  card: {
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
    borderRadius: 12,
    padding: 12,
  },
  subtitulo: { fontSize: 12, marginBottom: 8 },
  nota: { fontSize: 10.5, fontStyle: "italic" },
  separador: {
    height: 1,
    marginTop: 14,
    marginBottom: 14,
  },

  campo: { marginBottom: 14 },

  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.3,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 12,
  },
  inputDeshabilitado: {
    color: "#9CA3AF",
  },

  filaCelular: { flexDirection: "row", gap: 10 },
  prefijoBox: {
    borderWidth: 1.3,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    minWidth: 46,
    alignItems: "center",
  },
  prefijoBoxVacio: {},
  prefijoText: { fontSize: 12, fontWeight: "700" },
  prefijoTextVacio: {},
  inputCelular: { flex: 1 },
});
