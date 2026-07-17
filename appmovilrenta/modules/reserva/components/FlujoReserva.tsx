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

interface Props {
  vehiculo: Vehiculo;
}

export default function FlujoReserva({ vehiculo }: Props) {
  const insets = useSafeAreaInsets();
  const fechasLugar = useReservaStore((s) => s.fechasLugar);
  const limpiarReserva = useReservaStore((s) => s.limpiarReserva);

  // Ya no existe la sección "vehiculo" por separado — ahora arranca en
  // "fechas", que incluye tanto los datos del vehículo como el form.
  const [seccionActiva, setSeccionActiva] = useState<SeccionReserva>("fechas");
  const [modalResumenVisible, setModalResumenVisible] = useState(false);

  const puedeContinuar = !!fechasLugar.fechaRetiro && !!fechasLugar.fechaDevolucion && !!fechasLugar.metodoPago;

  const handleVolver = () => {
    limpiarReserva();
    router.back();
  };

  const handleContinuar = () => {
    if (!puedeContinuar) return;
    // Próximo paso: navegar a "Protección" — pendiente de implementar
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fila superior blanca: Volver / Resumen reserva */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={handleVolver} style={styles.volverBtn}>
          <Ionicons name="chevron-back" size={16} color={COLOR_MARCA} />
          <Text style={styles.volverText}>Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resumenBtn} onPress={() => setModalResumenVisible(true)}>
          <Text style={styles.resumenBtnText}>Resumen reserva</Text>
        </TouchableOpacity>
      </View>

      {/* Bloque azul: título + tabs. */}
      <View style={styles.headerAzul}>
        <Text style={styles.headerTitulo}>Reservar ahora</Text>
        <View style={styles.tabsWrapper}>
          <TabsSeccion seccionActiva={seccionActiva} onCambiarSeccion={setSeccionActiva} />
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
          {seccionActiva === "fechas" ? (
            <>
              {/* --- DATOS DEL VEHÍCULO: unido al tab de fechas --- */}
              <Text style={styles.seccionLabel}>Datos del vehículo</Text>
              <VehiculoResumenCard vehiculo={vehiculo} />

              <Text style={[styles.seccionLabel, { marginTop: 20 }]}>Seleccionar fechas y lugar</Text>
              <FormFechasLugar vehiculo={vehiculo} />

              <TouchableOpacity style={styles.continuarBtn} onPress={handleContinuar} activeOpacity={0.85}>
                <Text style={styles.continuarBtnText}>Continuar</Text>
              </TouchableOpacity>
            </>
          ) : (
            // --- PLANES: tab nuevo, todavía vacío ---
            <View style={styles.planesVacio}>
              <Text style={styles.planesVacioText}>Próximamente: protección, kilometraje y servicios adicionales.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <ResumenReservaModal
        visible={modalResumenVisible}
        vehiculo={vehiculo}
        onCerrar={() => setModalResumenVisible(false)}
        onEditarFechas={() => {
          setSeccionActiva("fechas");
          setModalResumenVisible(false);
        }}
        onEditarVehiculo={() => {
          setSeccionActiva("fechas");
          setModalResumenVisible(false);
        }}
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
  scrollContent: { padding: 16 },

  // Etiqueta de sección dentro del tab "fechas" (separa visualmente
  // "Datos del vehículo" de "Seleccionar fechas y lugar")
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

  planesVacio: { paddingVertical: 60, alignItems: "center" },
  planesVacioText: { fontSize: 13, color: COLORES.textMuted, textAlign: "center", paddingHorizontal: 24 },
});