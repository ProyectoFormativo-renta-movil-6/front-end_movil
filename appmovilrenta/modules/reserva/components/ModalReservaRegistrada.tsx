// modules/reserva/components/ModalReservaRegistrada.tsx
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_MARCA, COLORES } from "../constants/reserva.constants";

interface Props {
  visible: boolean;
  onPagarWompi: () => void;
  onCerrar: () => void;
}

export default function ModalReservaRegistrada({ visible, onPagarWompi, onCerrar }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconoWrap}>
            <Ionicons name="checkmark-circle" size={40} color={COLOR_MARCA} />
          </View>

          <Text style={styles.titulo}>Reserva Registrada</Text>

          <Text style={styles.descripcion}>
            Tu reserva quedó guardada como pendiente. Para confirmarla, completa el pago digital
            seguro con Wompi (Pruebas).
          </Text>

          <Text style={styles.linkTexto}>Serás redirigido al checkout oficial de Wompi.</Text>
          <Text style={styles.subTexto}>Recibirás la confirmación de tu reserva cuando el pago sea exitoso.</Text>

          <TouchableOpacity style={styles.botonWompi} onPress={onPagarWompi} activeOpacity={0.85}>
            <Ionicons name="card-outline" size={16} color="#fff" />
            <Text style={styles.botonWompiTexto}>Pagar con Wompi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: COLORES.panelBg,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
  },
  iconoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#eef2fb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORES.textPrimary,
    marginBottom: 10,
    textAlign: "center",
  },
  descripcion: {
    fontSize: 13,
    color: COLORES.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 14,
  },
  linkTexto: {
    fontSize: 12.5,
    fontWeight: "700",
    color: COLOR_MARCA,
    textAlign: "center",
    marginBottom: 4,
  },
  subTexto: {
    fontSize: 11.5,
    color: COLORES.textMuted,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 16,
  },
  botonWompi: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    backgroundColor: COLOR_MARCA,
    borderRadius: 14,
    paddingVertical: 15,
  },
  botonWompiTexto: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
});