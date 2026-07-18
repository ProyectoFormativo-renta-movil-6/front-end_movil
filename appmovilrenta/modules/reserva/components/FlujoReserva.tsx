// modules/reserva/components/FlujoReserva.tsx
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { useReservaStore } from "@/store/reservaStore";
import { COLOR_MARCA, COLORES } from "../constants/reserva.constants";
import VehiculoResumenCard from "./VehiculoResumenCard";
import FormFechasLugar from "./FormFechasLugar";
import ResumenReservaModal from "./ResumenReservaModal";
import TabsSeccion, { SeccionReserva } from "./TabsSeccion";
import PlanesAdicionales from "./PlanesAdicionales";
import FormDatosPersonales from "./FormDatosPersonales";
import { AlertModal } from "../../../components/ui/AlertModal";

interface Props {
  vehiculo: Vehiculo;
}

export default function FlujoReserva({ vehiculo }: Props) {
  const insets = useSafeAreaInsets();

  const fechasLugar = useReservaStore((s) => s.fechasLugar);
  const planes = useReservaStore((s) => s.planes);
  const limpiarReserva = useReservaStore((s) => s.limpiarReserva);

  const [seccionActiva, setSeccionActiva] = useState<SeccionReserva>("fechas");
  const [modalResumenVisible, setModalResumenVisible] = useState(false);
  const [alertaFaltantesVisible, setAlertaFaltantesVisible] = useState(false);

  // "Alcanzada alguna vez" — una vez true, nunca vuelve a false, aunque
  // el usuario regrese a un tab anterior. Esto es lo que usa el modal
  // de Resumen para decidir qué tarjetas mostrar (revelado progresivo).
  const [seccionesAlcanzadas, setSeccionesAlcanzadas] = useState<Record<SeccionReserva, boolean>>({
    fechas: true,
    planes: false,
    datos: false,
  });

  const puedeContinuarAPlanes =
    !!fechasLugar.fechaRetiro && !!fechasLugar.fechaDevolucion && !!fechasLugar.metodoPago;

  const puedeContinuarADatos = !!planes.proteccion && !!planes.tipoKilometraje;

  // Los tabs solo se bloquean HACIA ADELANTE. Nunca se bloquea el
  // regreso a un tab ya visitado, aunque luego cambien datos ahí.
  const tabsDeshabilitados: SeccionReserva[] = [
    ...(!puedeContinuarAPlanes ? (["planes", "datos"] as SeccionReserva[]) : []),
    ...(puedeContinuarAPlanes && !puedeContinuarADatos ? (["datos"] as SeccionReserva[]) : []),
  ];

  const irASeccion = (seccion: SeccionReserva) => {
    setSeccionActiva(seccion);
    setSeccionesAlcanzadas((prev) => (prev[seccion] ? prev : { ...prev, [seccion]: true }));
  };

  const handleVolver = () => {
    limpiarReserva();
    router.back();
  };

  // Botón del tab "fechas": si falta info, muestra alerta; si no, pasa al tab "planes".
  const handleVerPlanes = () => {
    if (puedeContinuarAPlanes) {
      irASeccion("planes");
      return;
    }
    setAlertaFaltantesVisible(true);
  };

  // Se dispara cuando en "planes" ya se eligió protección + kilometraje.
  const handleIrADatosPersonales = () => {
    irASeccion("datos");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={handleVolver} style={styles.volverBtn}>
          <Ionicons name="chevron-back" size={16} color={COLOR_MARCA} />
          <Text style={styles.volverText}>Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resumenBtn} onPress={() => setModalResumenVisible(true)}>
          <Text style={styles.resumenBtnText}>Resumen reserva</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerAzul}>
        <Text style={styles.headerTitulo}>Reservar ahora</Text>
        <View style={styles.tabsWrapper}>
          <TabsSeccion
            seccionActiva={seccionActiva}
            onCambiarSeccion={irASeccion}
            tabsDeshabilitados={tabsDeshabilitados}
          />
        </View>
      </View>

      <View style={styles.scrollClip}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {seccionActiva === "fechas" && (
            <>
              <Text style={styles.seccionLabel}>Datos del vehículo</Text>
              <VehiculoResumenCard vehiculo={vehiculo} />

              <Text style={[styles.seccionLabel, { marginTop: 20 }]}>Seleccionar fechas y lugar</Text>
              <FormFechasLugar vehiculo={vehiculo} />

              <TouchableOpacity style={styles.continuarBtn} onPress={handleVerPlanes} activeOpacity={0.85}>
                <Text style={styles.continuarBtnText}>Continuar</Text>
              </TouchableOpacity>
            </>
          )}

          {seccionActiva === "planes" && (
            <PlanesAdicionales vehiculo={vehiculo} onContinuar={handleIrADatosPersonales} />
          )}

          {seccionActiva === "datos" && <FormDatosPersonales vehiculo={vehiculo} />}
        </ScrollView>
      </View>

      <ResumenReservaModal
  visible={modalResumenVisible}
  vehiculo={vehiculo}
  mostrarPlanes={seccionesAlcanzadas.planes}
  seccionFechasCompleta={puedeContinuarAPlanes}
  onCerrar={() => setModalResumenVisible(false)}
/>

      <AlertModal
        visible={alertaFaltantesVisible}
        icono="alert-circle-outline"
        titulo="Faltan datos por completar"
        mensaje="Completa la información requerida para continuar con tu reserva."
        botones={[]}
        onCerrar={() => setAlertaFaltantesVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.pageBg },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORES.panelBg,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  volverBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  volverText: { fontSize: 13, fontWeight: "600", color: COLOR_MARCA },
  resumenBtn: {
    borderWidth: 1.5,
    borderColor: COLOR_MARCA,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  resumenBtnText: { fontSize: 12, fontWeight: "700", color: COLOR_MARCA },
  headerAzul: {
    backgroundColor: COLOR_MARCA,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 10,
    elevation: 10,
  },
  headerTitulo: { fontSize: 19, fontWeight: "800", color: "#FFFFFF", marginBottom: 12, textAlign: "center" },
  tabsWrapper: {},

  scrollClip: { flex: 1, overflow: "hidden" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, flexGrow: 1 },

  seccionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORES.textMuted,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  continuarBtn: {
    alignSelf: "center",
    backgroundColor: COLOR_MARCA,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  continuarBtnText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },

  placeholderWrap: {
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { fontSize: 16, color: "#6B7280" },
});