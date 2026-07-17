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

  const [seccionActiva, setSeccionActiva] = useState<SeccionReserva>("vehiculo");
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

      {/* Bloque azul: título + tabs.
          zIndex/elevation altos a propósito: garantiza que, incluso si el
          ScrollView de abajo llegara a solaparse visualmente (por rebote,
          alguna animación, etc.), el bloque azul siempre se dibuje por
          encima y nunca se vea "atravesado" por el contenido. */}
      <View style={styles.headerAzul}>
        <Text style={styles.headerTitulo}>Reservar ahora</Text>
        <View style={styles.tabsWrapper}>
          <TabsSeccion seccionActiva={seccionActiva} onCambiarSeccion={setSeccionActiva} />
        </View>
      </View>

      {/* Contenedor con overflow hidden: evita que cualquier contenido del
          scroll (imagen, sombra de la tarjeta, etc.) se "escape" visualmente
          por encima del límite superior del área scrolleable. */}
      <View style={styles.scrollClip}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {seccionActiva === "vehiculo" ? (
            <VehiculoResumenCard vehiculo={vehiculo} />
          ) : (
            <>
              <FormFechasLugar vehiculo={vehiculo} />

              {/* Botón Continuar, al final de la tarjeta de Fechas y lugar. Solo navega si puedeContinuar. */}
              <TouchableOpacity style={styles.continuarBtn} onPress={handleContinuar} activeOpacity={0.85}>
                <Text style={styles.continuarBtnText}>Continuar</Text>
              </TouchableOpacity>
            </>
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
          setSeccionActiva("vehiculo");
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

  continuarBtn: {
    alignSelf: "center",
    backgroundColor: COLOR_MARCA,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  continuarBtnText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
});