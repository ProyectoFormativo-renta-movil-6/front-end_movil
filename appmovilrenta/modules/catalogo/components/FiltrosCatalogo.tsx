import { Ionicons } from "@expo/vector-icons";
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
  CIUDADES_FILTRO,
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
  usuario: boolean;
  soloFavoritos: boolean;
  onToggleSoloFavoritos: () => void;
  totalFavoritos: number;
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

type DropdownAbierto = "ciudad" | "sucursal" | null;

export default function FiltrosCatalogo({
  visible,
  onClose,
  filtros,
  setFiltro,
  limpiar,
  usuario,
  soloFavoritos,
  onToggleSoloFavoritos,
  totalFavoritos,
}: Props) {
  const [dropdownAbierto, setDropdownAbierto] = useState<DropdownAbierto>(null);

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

  const toggleDropdown = (campo: "ciudad" | "sucursal") => {
    setDropdownAbierto((prev) => (prev === campo ? null : campo));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filtros</Text>
          <TouchableOpacity onPress={limpiar}>
            <Text style={styles.limpiarBtn}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {usuario && (
            <Seccion label="FAVORITOS">
              <TouchableOpacity
                style={[
                  styles.favoritoBtn,
                  soloFavoritos && styles.favoritoBtnActivo,
                ]}
                onPress={onToggleSoloFavoritos}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="heart"
                  size={15}
                  color={soloFavoritos ? "#fff" : COLORES.accentText}
                />
                <Text
                  style={[
                    styles.favoritoBtnText,
                    soloFavoritos && styles.favoritoBtnTextActivo,
                  ]}
                >
                  Mis Favoritos
                </Text>
                {totalFavoritos > 0 && (
                  <View
                    style={[styles.badge, soloFavoritos && styles.badgeActivo]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        soloFavoritos && styles.badgeTextActivo,
                      ]}
                    >
                      {totalFavoritos}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Seccion>
          )}

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

          <Seccion label="CIUDAD">
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => toggleDropdown("ciudad")}
            >
              <Text style={styles.selectorText}>{filtros.ciudad}</Text>
              <Text style={styles.selectorArrow}>
                {dropdownAbierto === "ciudad" ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {dropdownAbierto === "ciudad" && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {CIUDADES_FILTRO.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.dropdownItem,
                        filtros.ciudad === c && styles.dropdownItemActivo,
                      ]}
                      onPress={() => {
                        setFiltro("ciudad", c);
                        setDropdownAbierto(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          filtros.ciudad === c && styles.dropdownItemTextActivo,
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </Seccion>

          <Seccion label="SUCURSAL">
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => toggleDropdown("sucursal")}
            >
              <Text style={styles.selectorText} numberOfLines={1}>
                {filtros.sucursal}
              </Text>
              <Text style={styles.selectorArrow}>
                {dropdownAbierto === "sucursal" ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {dropdownAbierto === "sucursal" && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {SUCURSALES.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.dropdownItem,
                        filtros.sucursal === s && styles.dropdownItemActivo,
                      ]}
                      onPress={() => {
                        setFiltro("sucursal", s);
                        setDropdownAbierto(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          filtros.sucursal === s &&
                            styles.dropdownItemTextActivo,
                        ]}
                        numberOfLines={1}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </Seccion>

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
  container: { flex: 1, backgroundColor: COLORES.panelBg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: COLORES.textPrimary },
  limpiarBtn: { fontSize: 13, fontWeight: "700", color: COLORES.accentText },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 8 },
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
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORES.chipBg,
    marginBottom: 4,
  },
  chipActivo: { backgroundColor: COLORES.chipActiveBg },
  chipText: { fontSize: 13, fontWeight: "600", color: COLORES.chipText },
  chipTextoActivo: { color: COLORES.chipActiveText },
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
  selectorText: { fontSize: 13, color: COLORES.inputText, flex: 1 },
  selectorArrow: { fontSize: 11, color: COLORES.textSecondary, marginLeft: 8 },
  dropdownList: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORES.inputBorder,
    borderRadius: 10,
    backgroundColor: COLORES.panelBg,
    overflow: "hidden",
  },
  dropdownScroll: { maxHeight: 220 },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  dropdownItemActivo: { backgroundColor: COLORES.accentBgSoft },
  dropdownItemText: { fontSize: 13, color: COLORES.inputText },
  dropdownItemTextActivo: { color: COLORES.accentText, fontWeight: "700" },
  precioRow: { flexDirection: "row", gap: 10 },
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
  aplicarBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  favoritoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORES.accentBgSoft,
    borderWidth: 1.5,
    borderColor: COLORES.accentBorder,
  },
  favoritoBtnActivo: {
    backgroundColor: COLORES.chipActiveBg,
    borderColor: COLORES.chipActiveBg,
  },
  favoritoBtnText: { fontSize: 13, fontWeight: "700", color: COLORES.accentText },
  favoritoBtnTextActivo: { color: "#fff" },
  badge: {
    backgroundColor: COLORES.accentText,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  badgeActivo: { backgroundColor: "rgba(255,255,255,0.3)" },
  badgeText: { fontSize: 11, fontWeight: "800", color: "#fff" },
  badgeTextActivo: { color: "#fff" },
});