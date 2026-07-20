import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { useReservaStore } from "@/store/reservaStore";
import { COLOR_MARCA, COLORES, METODOS_PAGO } from "../constants/reserva.constants";
import { CIUDADES_DATA, getCiudadPorSucursal, getDireccionSucursal, getDisponibilidadVehiculo } from "@/modules/catalogo/constants/catalogo.constants";
import CalendarioRango from "./CalendarioRango";
import SelectorSucursalModal, { OpcionLugar } from "./SelectorSucursalModal";
import SelectorHoraModal from "./SelectorHoraModal";
import { AlertaPagoEfectivo } from "./AlertaPagoEfectivo";

interface Props {
  vehiculo: Vehiculo;
}

function formatFecha(fecha: string | null): string {
  if (!fecha) return "Seleccionar";
  const d = new Date(fecha + "T00:00:00");
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function FormFechasLugar({ vehiculo }: Props) {
  const fechasLugar = useReservaStore((s) => s.fechasLugar);
  const actualizarFechasLugar = useReservaStore((s) => s.actualizarFechasLugar);

  const [modalTipo, setModalTipo] = useState<"retiro" | "devolucion" | null>(null);
  const [horaVisible, setHoraVisible] = useState<"retiro" | "devolucion" | null>(null);
  const [alertaEfectivoVisible, setAlertaEfectivoVisible] = useState(false);

  const nombreSucursal = vehiculo.sucursal ?? "";
  const ciudadNombre = vehiculo.sucursal ? getCiudadPorSucursal(vehiculo.sucursal) : null;
  const ciudadInfo = ciudadNombre ? CIUDADES_DATA.find((c) => c.nombre === ciudadNombre) : null;

  const esWompi = fechasLugar.metodoPago === "wompi";

  const opcionesEntrega: OpcionLugar[] = useMemo(() => {
    const base: OpcionLugar[] = [
      { value: nombreSucursal, label: `Recoger en sucursal (${nombreSucursal})`, icono: "business-outline" },
    ];
    if (esWompi) {
      base.push({ value: "domicilio", label: "Entrega a domicilio", icono: "home-outline" });
      if (ciudadInfo?.tieneAeropuerto) {
        base.push({ value: "aeropuerto", label: "Entrega en aeropuerto", icono: "airplane-outline" });
      }
      if (ciudadInfo?.tieneTerminal) {
        base.push({ value: "terminal", label: "Entrega en terminal", icono: "bus-outline" });
      }
    }
    return base;
  }, [nombreSucursal, esWompi, ciudadInfo]);

  const opcionesDevolucion: OpcionLugar[] = useMemo(() => {
    const base: OpcionLugar[] = [
      { value: nombreSucursal, label: `Devolver en sucursal (${nombreSucursal})`, icono: "business-outline" },
    ];
    if (esWompi) {
      base.push({ value: "domicilio", label: "Devolución a domicilio", icono: "home-outline" });
      if (ciudadInfo?.tieneAeropuerto) {
        base.push({ value: "aeropuerto", label: "Devolución en aeropuerto", icono: "airplane-outline" });
      }
      if (ciudadInfo?.tieneTerminal) {
        base.push({ value: "terminal", label: "Devolución en terminal", icono: "bus-outline" });
      }
    }
    return base;
  }, [nombreSucursal, esWompi, ciudadInfo]);

  useEffect(() => {
    if (!esWompi) {
      const actualizacion: Partial<typeof fechasLugar> = {};
      if (fechasLugar.lugarRetiro && fechasLugar.lugarRetiro !== nombreSucursal) {
        actualizacion.lugarRetiro = nombreSucursal;
      }
      if (fechasLugar.lugarDevolucion && fechasLugar.lugarDevolucion !== nombreSucursal) {
        actualizacion.lugarDevolucion = nombreSucursal;
      }
      if (Object.keys(actualizacion).length > 0) {
        actualizarFechasLugar(actualizacion);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esWompi]);

  const handleElegirSucursal = (value: string) => {
    if (modalTipo === "retiro") actualizarFechasLugar({ lugarRetiro: value });
    if (modalTipo === "devolucion") actualizarFechasLugar({ lugarDevolucion: value });
    setModalTipo(null);
  };

  const handleElegirHora = (hora: string) => {
    const fecha = horaVisible === "retiro" ? fechasLugar.fechaRetiro : fechasLugar.fechaDevolucion;

    if (fecha) {
      // La disponibilidad ya no viene embebida en el vehículo — se calcula
      // a partir de RESERVAS_MOCK (mocks/reservas.json) según su id.
      const horasOcupadas = getDisponibilidadVehiculo(vehiculo.id).horasOcupadas?.[fecha] ?? [];
      const bloqueo = horasOcupadas.find((h) => h.hora === hora);

      if (bloqueo) {
        const mensaje =
          bloqueo.motivo === "mantenimiento"
            ? "El vehículo se encuentra en mantenimiento a esa hora. Elige otra hora."
            : "El vehículo ya está reservado a esa hora. Elige otra hora.";

        Alert.alert("Hora no disponible", mensaje, [
          { text: "Intentar de nuevo", style: "default" },
        ]);
        return;
      }
    }

    if (horaVisible === "retiro") actualizarFechasLugar({ horaRetiro: hora });
    else if (horaVisible === "devolucion") actualizarFechasLugar({ horaDevolucion: hora });
  };

  const labelLugarRetiro =
    opcionesEntrega.find((o) => o.value === fechasLugar.lugarRetiro)?.label ||
    fechasLugar.lugarRetiro ||
    "Seleccionar";
  const labelLugarDevolucion =
    opcionesDevolucion.find((o) => o.value === fechasLugar.lugarDevolucion)?.label ||
    fechasLugar.lugarDevolucion ||
    "Seleccionar";

  const ciudadEntregaNombre = ciudadInfo?.nombre ?? ciudadNombre ?? "";

  const mostrarDomicilioRetiro = fechasLugar.lugarRetiro === "domicilio";
  const mostrarDomicilioDevolucion = fechasLugar.lugarDevolucion === "domicilio";

  return (
    <View style={styles.card}>
      <Text style={[styles.tituloSeccion, styles.primerLabel]}>MÉTODO DE PAGO PREFERIDO</Text>
      <View style={styles.filaDosCols}>
        {METODOS_PAGO.map((metodo) => {
          const activo = fechasLugar.metodoPago === metodo.id;
          return (
            <TouchableOpacity
              key={metodo.id}
              style={[styles.metodoCard, activo && styles.metodoCardActivo]}
              onPress={() => {
                actualizarFechasLugar({ metodoPago: metodo.id });
                if (metodo.id === "efectivo") setAlertaEfectivoVisible(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.metodoHeaderRow}>
                <Text style={[styles.metodoTitulo, activo && styles.metodoTituloActivo]}>
                  {metodo.titulo}
                </Text>
                <View style={[styles.radio, activo && styles.radioActivo]}>
                  {activo && <View style={styles.radioPunto} />}
                </View>
              </View>
              <Text style={[styles.metodoDesc, activo && styles.metodoDescActivo]}>
                {metodo.descripcion}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.tituloSeccion}>LUGAR Y HORA DE ENTREGA/DEVOLUCIÓN</Text>
      <View style={styles.filaDosCols}>
        <TouchableOpacity style={styles.selectBox} onPress={() => setModalTipo("retiro")}>
          <View style={styles.selectLabelRow}>
            <Ionicons name="location-outline" size={12} color={COLORES.textMuted} />
            <Text style={styles.selectLabel}>LUGAR DE RETIRO</Text>
          </View>
          <Text style={styles.selectValue} numberOfLines={1}>
            {labelLugarRetiro}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectBox} onPress={() => setModalTipo("devolucion")}>
          <View style={styles.selectLabelRow}>
            <Ionicons name="location-outline" size={12} color={COLORES.textMuted} />
            <Text style={styles.selectLabel}>LUGAR DE DEVOLUCIÓN</Text>
          </View>
          <Text style={styles.selectValue} numberOfLines={1}>
            {labelLugarDevolucion}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- INFO DE ENTREGA A DOMICILIO (solo si lugarRetiro === "domicilio") --- */}
      {mostrarDomicilioRetiro && (
        <View style={styles.domicilioCard}>
          <Text style={styles.domicilioTitulo}>INFORMACIÓN DE ENTREGA A DOMICILIO</Text>

          <View style={styles.ciudadBox}>
            <View style={styles.selectLabelRow}>
              <Ionicons name="location" size={13} color={COLOR_MARCA} />
              <Text style={styles.ciudadLabel}>CIUDAD DE ENTREGA</Text>
            </View>
            <View style={styles.ciudadValorRow}>
              <Text style={styles.ciudadValor}>{ciudadEntregaNombre}</Text>
              <Text style={styles.autoDetectado}>AUTO-DETECTADO</Text>
            </View>
          </View>

          <Text style={styles.inputLabel}>BARRIO *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Centro"
            placeholderTextColor={COLORES.textMuted}
            value={fechasLugar.barrioRetiro ?? ""}
            onChangeText={(texto) => actualizarFechasLugar({ barrioRetiro: texto })}
          />

          <Text style={styles.inputLabel}>DIRECCIÓN *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Calle 10 # 5 - 42"
            placeholderTextColor={COLORES.textMuted}
            value={fechasLugar.direccionRetiro ?? ""}
            onChangeText={(texto) => actualizarFechasLugar({ direccionRetiro: texto })}
          />

          <Text style={styles.inputLabel}>REFERENCIAS DE ENTREGA *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Frente al parque, indicaciones adicionales..."
            placeholderTextColor={COLORES.textMuted}
            value={fechasLugar.referenciasRetiro ?? ""}
            onChangeText={(texto) => actualizarFechasLugar({ referenciasRetiro: texto })}
          />
        </View>
      )}

      {/* --- INFO DE DEVOLUCIÓN A DOMICILIO (solo si lugarDevolucion === "domicilio") --- */}
      {mostrarDomicilioDevolucion && (
        <View style={styles.domicilioCard}>
          <Text style={styles.domicilioTitulo}>INFORMACIÓN DE DEVOLUCIÓN A DOMICILIO</Text>

          <View style={styles.ciudadBox}>
            <View style={styles.selectLabelRow}>
              <Ionicons name="location" size={13} color={COLOR_MARCA} />
              <Text style={styles.ciudadLabel}>CIUDAD DE DEVOLUCIÓN</Text>
            </View>
            <View style={styles.ciudadValorRow}>
              <Text style={styles.ciudadValor}>{ciudadEntregaNombre}</Text>
              <Text style={styles.autoDetectado}>AUTO-DETECTADO</Text>
            </View>
          </View>

          <Text style={styles.inputLabel}>BARRIO *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Centro"
            placeholderTextColor={COLORES.textMuted}
            value={fechasLugar.barrioDevolucion ?? ""}
            onChangeText={(texto) => actualizarFechasLugar({ barrioDevolucion: texto })}
          />

          <Text style={styles.inputLabel}>DIRECCIÓN *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Calle 10 # 5 - 42"
            placeholderTextColor={COLORES.textMuted}
            value={fechasLugar.direccionDevolucion ?? ""}
            onChangeText={(texto) => actualizarFechasLugar({ direccionDevolucion: texto })}
          />

          <Text style={styles.inputLabel}>REFERENCIAS DE DEVOLUCIÓN *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Frente al parque, indicaciones adicionales..."
            placeholderTextColor={COLORES.textMuted}
            value={fechasLugar.referenciasDevolucion ?? ""}
            onChangeText={(texto) => actualizarFechasLugar({ referenciasDevolucion: texto })}
          />
        </View>
      )}

      <View style={[styles.filaDosCols, { marginTop: 8 }]}>
        <TouchableOpacity style={styles.selectBox} onPress={() => setHoraVisible("retiro")}>
          <View style={styles.selectLabelRow}>
            <Ionicons name="time-outline" size={12} color={COLORES.textMuted} />
            <Text style={styles.selectLabel}>HORA DE RETIRO</Text>
          </View>
          <View style={styles.selectValorRow}>
            <Text style={styles.selectValue}>{fechasLugar.horaRetiro || "Seleccionar"}</Text>
            <Ionicons name="chevron-down" size={14} color={COLORES.textMuted} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectBox} onPress={() => setHoraVisible("devolucion")}>
          <View style={styles.selectLabelRow}>
            <Ionicons name="time-outline" size={12} color={COLORES.textMuted} />
            <Text style={styles.selectLabel}>HORA DE DEVOLUCIÓN</Text>
          </View>
          <View style={styles.selectValorRow}>
            <Text style={styles.selectValue}>{fechasLugar.horaDevolucion || "Seleccionar"}</Text>
            <Ionicons name="chevron-down" size={14} color={COLORES.textMuted} />
          </View>
        </TouchableOpacity>
      </View>

      {/* --- CALENDARIO DE DISPONIBILIDAD (justo después de la hora) --- */}
      <View style={styles.labelConIcono}>
        <Ionicons name="calendar-outline" size={13} color={COLORES.textMuted} />
        <Text style={styles.tituloSeccion}>CALENDARIO DE DISPONIBILIDAD</Text>
      </View>
      <CalendarioRango
        vehiculo={vehiculo}
        fechaRetiro={fechasLugar.fechaRetiro}
        fechaDevolucion={fechasLugar.fechaDevolucion}
        onCambiarFechas={(retiro, devolucion) =>
          actualizarFechasLugar({ fechaRetiro: retiro, fechaDevolucion: devolucion })
        }
      />

      {/* --- FECHAS AUTOMÁTICAS (se llenan solas con lo elegido en el calendario) --- */}
      <View style={[styles.filaDosCols, { marginTop: 12 }]}>
        <View style={styles.selectBox}>
          <View style={styles.selectLabelRow}>
            <Ionicons name="calendar-outline" size={12} color={COLORES.textMuted} />
            <Text style={styles.selectLabel}>FECHA DE RETIRO</Text>
          </View>
          <Text style={styles.selectValue} numberOfLines={1}>
            {formatFecha(fechasLugar.fechaRetiro)}
          </Text>
        </View>
        <View style={styles.selectBox}>
          <View style={styles.selectLabelRow}>
            <Ionicons name="calendar-outline" size={12} color={COLORES.textMuted} />
            <Text style={styles.selectLabel}>FECHA DE DEVOLUCIÓN</Text>
          </View>
          <Text style={styles.selectValue} numberOfLines={1}>
            {formatFecha(fechasLugar.fechaDevolucion)}
          </Text>
        </View>
      </View>

      <SelectorSucursalModal
        visible={modalTipo !== null}
        titulo={modalTipo === "retiro" ? "Lugar de retiro" : "Lugar de devolución"}
        opciones={modalTipo === "retiro" ? opcionesEntrega : opcionesDevolucion}
        onSeleccionar={handleElegirSucursal}
        onCerrar={() => setModalTipo(null)}
      />

      <SelectorHoraModal
        visible={horaVisible !== null}
        horaSeleccionada={horaVisible === "retiro" ? fechasLugar.horaRetiro : fechasLugar.horaDevolucion}
        onSeleccionar={handleElegirHora}
        onCerrar={() => setHoraVisible(null)}
      />

      <AlertaPagoEfectivo
        visible={alertaEfectivoVisible}
        nombreSucursal={nombreSucursal}
        ciudad={ciudadEntregaNombre || ciudadNombre}
        direccion={getDireccionSucursal(nombreSucursal)}
        onCerrar={() => setAlertaEfectivoVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  tituloSeccion: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORES.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 8,
    marginTop: 4,
  },
  primerLabel: { marginTop: 0 },
  labelConIcono: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4, marginBottom: 8 },
  filaDosCols: { flexDirection: "row", gap: 8, marginBottom: 14 },
  metodoCard: { flex: 1, borderWidth: 1, borderColor: COLORES.panelBorderStrong, borderRadius: 10, padding: 10 },
  metodoCardActivo: { borderColor: COLOR_MARCA, borderWidth: 1.5, backgroundColor: "#eef2fb" },
  metodoHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  metodoTitulo: { fontSize: 11, fontWeight: "700", color: COLORES.textSecondary, flex: 1, marginRight: 6 },
  metodoTituloActivo: { color: "#0c447c" },
  metodoDesc: { fontSize: 9, color: COLORES.textMuted, marginTop: 4 },
  metodoDescActivo: { color: "#185fa5" },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: COLORES.panelBorderStrong, alignItems: "center", justifyContent: "center" },
  radioActivo: { borderColor: COLOR_MARCA },
  radioPunto: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLOR_MARCA },
  selectBox: { flex: 1, borderWidth: 1, borderColor: COLORES.panelBorderStrong, borderRadius: 10, padding: 9 },
  selectLabelRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
  selectLabel: { fontSize: 9, color: COLORES.textMuted, fontWeight: "700" },
  selectValue: { fontSize: 11, fontWeight: "600", color: COLORES.textPrimary },
  selectValorRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  // --- Bloque de información a domicilio ---
  domicilioCard: {
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    marginTop: -6,
  },
  domicilioTitulo: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0c447c",
    marginBottom: 10,
  },
  ciudadBox: {
    backgroundColor: "#eef2fb",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  ciudadLabel: { fontSize: 9, fontWeight: "700", color: COLORES.textMuted, letterSpacing: 0.3 },
  ciudadValorRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  ciudadValor: { fontSize: 13, fontWeight: "700", color: COLORES.textPrimary },
  autoDetectado: { fontSize: 9, fontWeight: "700", color: COLOR_MARCA, letterSpacing: 0.3 },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORES.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 5,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 12,
    color: COLORES.textPrimary,
    backgroundColor: "#fafbfd",
    marginBottom: 4,
  },
});