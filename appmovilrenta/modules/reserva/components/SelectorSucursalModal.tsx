import React from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_MARCA, COLORES } from "../constants/reserva.constants";

export interface OpcionLugar {
  value: string;
  label: string;
  icono?: keyof typeof Ionicons.glyphMap;
}

interface Props {
  visible: boolean;
  titulo?: string;
  opciones: OpcionLugar[];
  onSeleccionar: (value: string) => void;
  onCerrar: () => void;
}

export default function SelectorSucursalModal({ visible, titulo, opciones, onSeleccionar, onCerrar }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCerrar}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onCerrar}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.headerTitulo}>{titulo ?? "Elige el lugar"}</Text>
            <TouchableOpacity onPress={onCerrar}>
              <Ionicons name="close" size={22} color={COLORES.textSecondary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={opciones}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.opcion} onPress={() => onSeleccionar(item.value)}>
                <Ionicons name={item.icono ?? "location-outline"} size={16} color={COLOR_MARCA} />
                <Text style={styles.opcionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay opciones disponibles</Text>
            }
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: COLORES.panelBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  headerTitulo: { fontSize: 15, fontWeight: "800", color: COLORES.textPrimary },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  opcionText: { fontSize: 13, fontWeight: "600", color: COLORES.textPrimary },
  emptyText: { fontSize: 12, color: COLORES.textMuted, textAlign: "center", padding: 20 },
});