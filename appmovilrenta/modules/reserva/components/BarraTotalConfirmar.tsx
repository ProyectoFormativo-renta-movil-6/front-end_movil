// modules/reserva/components/BarraTotalConfirmar.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_MARCA, COLORES } from "../constants/reserva.constants";
import { fmt, styles as piezas } from "./ResumenReservaModal.piezas";

interface Props {
  total: number;
  onConfirmar: () => void;
}

export default function BarraTotalConfirmar({ total, onConfirmar }: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={piezas.totalBlock}>
        <Text style={piezas.totalLabelChica}>TOTAL A PAGAR</Text>
        <Text style={piezas.totalValorGrande}>{fmt(total)}</Text>
        <Text style={piezas.totalNota}>*Incluye impuestos y cargos administrativos</Text>
      </View>

      <TouchableOpacity style={styles.boton} onPress={onConfirmar} activeOpacity={0.85}>
        <Text style={styles.botonTexto}>Confirmar reserva</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES.panelBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 4,
  },
  boton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLOR_MARCA,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    borderRadius: 14,
    paddingVertical: 15,
  },
  botonTexto: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
});