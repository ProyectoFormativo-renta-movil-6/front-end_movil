// modules/reserva/components/FormDatosPersonales.tsx
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import {
  COLOR_MARCA,
  COLORES,
  NACIONALIDADES,
  PORCENTAJE_CARGOS_ADMINISTRATIVOS,
  PORCENTAJE_IVA,
  RECARGO_LOGISTICO,
  TIPOS_DOCUMENTO,
  getPrefijoPorNacionalidad,
} from "../constants/reserva.constants";
import { useReservaStore } from "@/store/reservaStore";
import CampoSelectorLista from "./CampoSelectorLista";
import TarjetaVerificacionDocumental from "./TarjetaVerificacionDocumental";
import TarjetaTerminosCondiciones from "./TarjetaTerminosCondiciones";
import BarraTotalConfirmar from "./BarraTotalConfirmar";
import ModalReservaRegistrada from "./ModalReservaRegistrada";
import { diasEntre } from "./ResumenReservaModal.piezas";
import { AlertModal } from "../../../components/ui/AlertModal";

const OPCIONES_TIPO_DOCUMENTO = TIPOS_DOCUMENTO.map((t) => ({ id: t.id, label: t.label }));
const OPCIONES_NACIONALIDAD = NACIONALIDADES.map((n) => ({ id: n.nombre, label: n.nombre }));

interface Props {
  vehiculo: Vehiculo;
}

export default function FormDatosPersonales({ vehiculo }: Props) {
  const datosPersonales = useReservaStore((s) => s.datosPersonales);
  const actualizarDatosPersonales = useReservaStore((s) => s.actualizarDatosPersonales);
  const fechasLugar = useReservaStore((s) => s.fechasLugar);
  const planes = useReservaStore((s) => s.planes);
  const documentos = useReservaStore((s) => s.documentos);

  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [alertaFaltantesVisible, setAlertaFaltantesVisible] = useState(false);

  // Vacío hasta que el usuario elige nacionalidad — no cae a +57 por defecto.
  const prefijoTelefono = getPrefijoPorNacionalidad(datosPersonales.nacionalidad || null);
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

    const seguroElegido = seguros.find((s) => s.nombre === planes.proteccion) ?? null;
    const kmElegido = planes.tipoKilometraje === "limitado" ? kmLimitado : planes.tipoKilometraje === "ilimitado" ? kmIlimitado : null;

    const dias = diasEntre(fechasLugar.fechaRetiro, fechasLugar.fechaDevolucion);
    const diarias = vehiculo.precio * dias;
    const proteccion = seguroElegido ? seguroElegido.precio * dias : 0;
    const kilometraje = kmElegido ? kmElegido.precio * dias : 0;
    const servAdic = servicios
      .filter((s) => planes.serviciosSeleccionados.includes(s.nombre))
      .reduce((a, s) => a + s.precio * dias, 0);
    const cargos = Math.round(diarias * PORCENTAJE_CARGOS_ADMINISTRATIVOS);
    const subtotal = diarias + proteccion + kilometraje + servAdic + cargos + RECARGO_LOGISTICO;
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
          <Text style={styles.subtitulo}>Informa tus datos para que podamos realizar tu reserva.</Text>
          <Text style={styles.nota}>Los campos marcados con asterisco (*) son obligatorios.</Text>

          <View style={styles.separador} />

          <View style={styles.campo}>
            <Text style={styles.inputLabel}>NOMBRE COMPLETO *</Text>
            <TextInput
              style={styles.input}
              value={datosPersonales.nombreCompleto}
              onChangeText={(v) => actualizarDatosPersonales({ nombreCompleto: v })}
              placeholderTextColor={COLORES.textMuted}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.campo}>
            <CampoSelectorLista
              etiqueta="NACIONALIDAD *"
              valorSeleccionado={datosPersonales.nacionalidad || null}
              opciones={OPCIONES_NACIONALIDAD}
              onSeleccionar={(id) => actualizarDatosPersonales({ nacionalidad: id })}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.inputLabel}>CORREO ELECTRÓNICO *</Text>
            <TextInput
              style={styles.input}
              value={datosPersonales.correo}
              onChangeText={(v) => actualizarDatosPersonales({ correo: v })}
              placeholderTextColor={COLORES.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.inputLabel}>NÚMERO DE CELULAR *</Text>
            <View style={styles.filaCelular}>
              <View style={[styles.prefijoBox, !hayPrefijo && styles.prefijoBoxVacio]}>
                <Text style={[styles.prefijoText, !hayPrefijo && styles.prefijoTextVacio]}>
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
                onChangeText={(v) => actualizarDatosPersonales({ celular: v.replace(/\D/g, "") })}
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
              onSeleccionar={(id) =>
                actualizarDatosPersonales({ tipoDocumento: id as typeof datosPersonales.tipoDocumento })
              }
            />
          </View>

          <View style={[styles.campo, { marginBottom: 0 }]}>
            <Text style={styles.inputLabel}>NÚMERO DE DOCUMENTO *</Text>
            <TextInput
              style={styles.input}
              value={datosPersonales.numeroDocumento}
              onChangeText={(v) => actualizarDatosPersonales({ numeroDocumento: v })}
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
  separador: { height: 1, backgroundColor: COLORES.panelBorder, marginTop: 14, marginBottom: 14 },

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