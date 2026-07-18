import React from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_MARCA, COLORES } from "../constants/reserva.constants";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  resumen?: string;
  completo?: boolean;
  abierto: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function SeccionAcordeon({
  icono,
  titulo,
  resumen,
  completo = false,
  abierto,
  onToggle,
  children,
}: Props) {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={[styles.container, abierto && styles.containerAbierto]}>
      <TouchableOpacity style={styles.header} onPress={handleToggle} activeOpacity={0.7}>
        <View style={[styles.iconoWrap, completo && styles.iconoWrapCompleto]}>
          <Ionicons
            name={completo ? "checkmark" : icono}
            size={16}
            color={completo ? "#fff" : COLOR_MARCA}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>{titulo}</Text>
          {!abierto && resumen && (
            <Text style={styles.resumen} numberOfLines={1}>{resumen}</Text>
          )}
        </View>

        <Ionicons
          name={abierto ? "chevron-up" : "chevron-down"}
          size={18}
          color={COLORES.textMuted}
        />
      </TouchableOpacity>

      {abierto && <View style={styles.contenido}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: COLORES.panelBg,
    overflow: "hidden",
  },
  containerAbierto: {
    borderColor: COLOR_MARCA,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  iconoWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#eef2fb",
    alignItems: "center",
    justifyContent: "center",
  },
  iconoWrapCompleto: {
    backgroundColor: "#16a34a",
  },
  titulo: { fontSize: 13, fontWeight: "700", color: COLORES.textPrimary },
  resumen: { fontSize: 11, color: COLORES.textMuted, marginTop: 2 },
  contenido: { paddingHorizontal: 14, paddingBottom: 14 },
});