// modules/catalogo/components/FiltrosCatalogo.tsx

import React, { useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    CATEGORIAS,
    COLORES,
    COMBUSTIBLES,
    SUCURSALES,
    TRANSMISIONES,
} from "../constants/catalogo.constants";
import { FiltrosCatalogoState } from "../types/catalogo.types";

interface Props {
  visible: boolean;
  onClose: () => void;
  filtros: FiltrosCatalogoState;
  setFiltro: (campo: keyof FiltrosCatalogoState, valor: string) => void;
  limpiar: () => void;
}

function Chip({
  label,
  activo,
  onPress,
}: {
  label: string;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, activo && styles.chipActivo]}
    >
      <Text style={[styles.chipText, activo && styles.chipTextoActivo]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Seccion({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.seccion}>
      <Text style={styles.seccionLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function FiltrosCatalogo({
  visible,
  onClose,
  filtros,
  setFiltro,
  limpiar,
}: Props) {
  const [sucursalOpen, setSucursalOpen] = useState(false);

  const catLabels: Record<string, string> = {
    Todos: "Todas las categorías",
    Sedan: "Sedan",
    SUV: "SUV",
    Económico: "Económico",
    Deportivo: "Deportivo",
  };

  const transLabels: Record<string, string> = {
    Todas: "Todas",
    Automática: "Automática",
    Manual: "Manual",
  };

  const fuelLabels: Record<string, string> = {
    Todos: "Todos",
    Gasolina: "Gasolina",
    Diesel: "Diesel",
    Híbrido: "Híbrido",
    Eléctrico: "Eléctrico",
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filtros</Text>
          <TouchableOpacity
            onPress={() => {
              limpiar();
            }}
          >
            <Text style={styles.limpiarBtn}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* CATEGORÍA */}
          <Seccion label="CATEGORÍA">
            <View style={styles.chipsRow}>
              {CATEGORIAS.map((cat) => (
                <Chip
                  key={cat}
                  label={catLabels[cat] ?? cat}
                  activo={filtros.categoria === cat}
                  onPress={() => setFiltro("categoria", cat)}
                />
              ))}
            </View>
          </Seccion>

          {/* SUCURSAL */}
          <Seccion label="SUCURSAL">
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => setSucursalOpen(!sucursalOpen)}
            >
              <Text style={styles.selectorText}>
                {filtros.sucursal || "Todas las sucursales"}
              </Text>
              <Text style={styles.selectorArrow}>
                {sucursalOpen ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {sucursalOpen && (
              <View style={styles.dropdownList}>
                {SUCURSALES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.dropdownItem,
                      filtros.sucursal === s && styles.dropdownItemActivo,
                    ]}
                    onPress={() => {
                      setFiltro("sucursal", s);
                      setSucursalOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        filtros.sucursal === s && styles.dropdownItemTextActivo,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Seccion>

          {/* PRECIO POR DÍA */}
          <Seccion label="PRECIO POR DÍA (COP)">
            <View style={styles.precioRow}>
              <TextInput
                style={styles.precioInput}
                placeholder="Mín"
                placeholderTextColor={COLORES.textMuted}
                keyboardType="numeric"
                value={filtros.precioMin}
                onChangeText={(v) =>
                  setFiltro("precioMin", v.replace(/[^0-9]/g, ""))
                }
              />
              <TextInput
                style={styles.precioInput}
                placeholder="Máx"
                placeholderTextColor={COLORES.textMuted}
                keyboardType="numeric"
                value={filtros.precioMax}
                onChangeText={(v) =>
                  setFiltro("precioMax", v.replace(/[^0-9]/g, ""))
                }
              />
            </View>
          </Seccion>

          {/* TRANSMISIÓN */}
          <Seccion label="TRANSMISIÓN">
            <View style={styles.chipsRow}>
              {TRANSMISIONES.map((tr) => (
                <Chip
                  key={tr}
                  label={transLabels[tr] ?? tr}
                  activo={filtros.transmision === tr}
                  onPress={() => setFiltro("transmision", tr)}
                />
              ))}
            </View>
          </Seccion>

          {/* COMBUSTIBLE */}
          <Seccion label="COMBUSTIBLE">
            <View style={styles.chipsRow}>
              {COMBUSTIBLES.map((c) => (
                <Chip
                  key={c}
                  label={fuelLabels[c] ?? c}
                  activo={filtros.combustible === c}
                  onPress={() => setFiltro("combustible", c)}
                />
              ))}
            </View>
          </Seccion>
        </ScrollView>

        {/* Botón Aplicar */}
        <View style={styles.footerBtn}>
          <TouchableOpacity style={styles.aplicarBtn} onPress={onClose}>
            <Text style={styles.aplicarBtnText}>Aplicar filtros</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.panelBg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORES.textPrimary,
  },
  limpiarBtn: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORES.accentText,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 8,
  },
  seccion: {
    marginBottom: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  seccionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORES.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORES.chipBg,
    marginBottom: 4,
  },
  chipActivo: {
    backgroundColor: COLORES.chipActiveBg,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORES.chipText,
  },
  chipTextoActivo: {
    color: COLORES.chipActiveText,
  },
  selectorBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: COLORES.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: COLORES.inputBg,
  },
  selectorText: {
    fontSize: 13,
    color: COLORES.inputText,
    flex: 1,
  },
  selectorArrow: {
    fontSize: 11,
    color: COLORES.textSecondary,
    marginLeft: 8,
  },
  dropdownList: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORES.inputBorder,
    borderRadius: 10,
    backgroundColor: COLORES.panelBg,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  dropdownItemActivo: {
    backgroundColor: COLORES.accentBgSoft,
  },
  dropdownItemText: {
    fontSize: 13,
    color: COLORES.inputText,
  },
  dropdownItemTextActivo: {
    color: COLORES.accentText,
    fontWeight: "700",
  },
  precioRow: {
    flexDirection: "row",
    gap: 10,
  },
  precioInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORES.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORES.inputText,
    backgroundColor: COLORES.inputBg,
  },
  footerBtn: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORES.panelBorder,
  },
  aplicarBtn: {
    backgroundColor: COLORES.accentText,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  aplicarBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
