import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useReservaStore } from "@/store/reservaStore";
import FlujoReserva from "@/modules/reserva/components/FlujoReserva";
import { COLOR_MARCA } from "@/modules/reserva/constants/reserva.constants";

export default function ReservarScreen() {
  const insets = useSafeAreaInsets();
  const vehiculo = useReservaStore((s) => s.vehiculoSeleccionado);

  if (!vehiculo) {
    return (
      <View style={[styles.vacioContainer, { paddingTop: insets.top }]}>
        <Ionicons name="car-sport-outline" size={56} color="#CBD5E1" />
        <Text style={styles.vacioTitulo}>Aún no elegiste un vehículo</Text>
        <Text style={styles.vacioTexto}>
          Volvé al catálogo y tocá &ldquo;Reservar ahora&rdquo; en el auto que quieras.
        </Text>
        <TouchableOpacity style={styles.vacioBtn} onPress={() => router.push("/(tabs)/catalogo")}>
          <Text style={styles.vacioBtnText}>Ir al catálogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <FlujoReserva vehiculo={vehiculo} />;
}

const styles = StyleSheet.create({
  vacioContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, backgroundColor: "#FFFFFF" },
  vacioTitulo: { fontSize: 16, fontWeight: "800", color: "#334155", marginTop: 16 },
  vacioTexto: { fontSize: 13, color: "#94A3B8", textAlign: "center", marginTop: 6, marginBottom: 20 },
  vacioBtn: { backgroundColor: COLOR_MARCA, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  vacioBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});