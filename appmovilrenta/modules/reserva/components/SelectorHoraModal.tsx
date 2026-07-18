import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { COLOR_MARCA, COLORES, formatHoraAmPm } from "../constants/reserva.constants";

function generarHoras(): string[] {
  const horas: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      horas.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return horas;
}

const HORAS = generarHoras();

interface Props {
  visible: boolean;
  horaSeleccionada: string;
  onSeleccionar: (hora: string) => void;
  onCerrar: () => void;
}

export default function SelectorHoraModal({ visible, horaSeleccionada, onSeleccionar, onCerrar }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <TouchableWithoutFeedback onPress={onCerrar}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.headerTitulo}>Selecciona la hora</Text>
                <TouchableOpacity onPress={onCerrar} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.cerrarTexto}>Cerrar</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
                {HORAS.map((hora) => {
                  const activa = hora === horaSeleccionada;
                  return (
                    <TouchableOpacity
                      key={hora}
                      style={[styles.item, activa && styles.itemActivo]}
                      onPress={() => {
                        onSeleccionar(hora);
                        onCerrar();
                      }}
                    >
                      {/* Se muestra con a. m. / p. m. para que no quede ambiguo */}
                      <Text style={[styles.itemTexto, activa && styles.itemTextoActivo]}>
                        {formatHoraAmPm(hora)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(15,23,42,0.45)", justifyContent: "flex-end" },
  card: {
    backgroundColor: COLORES.panelBg,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "65%",
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  headerTitulo: { fontSize: 14, fontWeight: "800", color: COLORES.textPrimary },
  cerrarTexto: { fontSize: 13, fontWeight: "700", color: COLOR_MARCA },
  lista: { paddingHorizontal: 8, paddingTop: 4 },
  item: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10 },
  itemActivo: { backgroundColor: "#eef2fb" },
  itemTexto: { fontSize: 13, fontWeight: "600", color: COLORES.textSecondary },
  itemTextoActivo: { fontWeight: "800", color: COLOR_MARCA },
});