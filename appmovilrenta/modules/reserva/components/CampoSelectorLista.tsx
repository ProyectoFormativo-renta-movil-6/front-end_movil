// modules/reserva/components/CampoSelectorLista.tsx
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_MARCA, COLORES } from "../constants/reserva.constants";

interface Opcion {
  id: string;
  label: string;
}

interface Props {
  etiqueta: string;
  valorSeleccionado: string | null;
  opciones: Opcion[];
  onSeleccionar: (id: string) => void;
  placeholder?: string;
}

export default function CampoSelectorLista({
  etiqueta,
  valorSeleccionado,
  opciones,
  onSeleccionar,
  placeholder = "Seleccionar",
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const opcionActual = opciones.find((o) => o.id === valorSeleccionado);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.selectLabel}>{etiqueta}</Text>

      <TouchableOpacity style={styles.selectBox} onPress={() => setAbierto(true)} activeOpacity={0.8}>
        <Text style={[styles.selectValue, !opcionActual && styles.placeholder]} numberOfLines={1}>
          {opcionActual?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={14} color={COLOR_MARCA} />
      </TouchableOpacity>

      <Modal visible={abierto} animationType="slide" transparent onRequestClose={() => setAbierto(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setAbierto(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.header}>
              <Text style={styles.headerTitulo}>{etiqueta}</Text>
              <TouchableOpacity onPress={() => setAbierto(false)}>
                <Ionicons name="close" size={22} color={COLORES.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={opciones}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const activo = item.id === valorSeleccionado;
                return (
                  <TouchableOpacity
                    style={[styles.opcion, activo && styles.opcionActiva]}
                    onPress={() => {
                      onSeleccionar(item.id);
                      setAbierto(false);
                    }}
                  >
                    <Text style={[styles.opcionText, activo && styles.opcionTextActiva]}>
                      {item.label}
                    </Text>
                    {activo && <Ionicons name="checkmark" size={16} color={COLOR_MARCA} />}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay opciones disponibles</Text>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1 },

  selectLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORES.textSecondary,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  // Borde azul de marca fijo, igual que "input" en FormDatosPersonales.tsx
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.3,
    borderColor: COLOR_MARCA,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#fafbfd",
  },
  selectValue: { fontSize: 11, fontWeight: "600", color: COLORES.textPrimary, flex: 1, marginRight: 6 },
  placeholder: { color: COLORES.textMuted, fontWeight: "400" },

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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  opcionActiva: { backgroundColor: "#eef2fb" },
  opcionText: { fontSize: 13, fontWeight: "600", color: COLORES.textPrimary },
  opcionTextActiva: { color: "#0c447c", fontWeight: "700" },
  emptyText: { fontSize: 12, color: COLORES.textMuted, textAlign: "center", padding: 20 },
});