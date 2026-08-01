import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  icono: keyof typeof Ionicons.glyphMap;
  texto: string;
  primaryBg: string;
}

// Encabezado de sección liviano: ícono de color + texto — sin envolver los
// campos en una caja con borde (evita que los formularios se vean "muy
// blancos"/cargados; el color se usa en el encabezado, no en contenedores).
export function SectionLabel({ icono, texto, primaryBg }: Props) {
  return (
    <View style={s.row}>
      <View style={[s.iconWrap, { backgroundColor: primaryBg }]}>
        <Ionicons name={icono} size={13} color="#1D4ED8" />
      </View>
      <Text style={s.texto}>{texto}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D4ED8",
    letterSpacing: 1,
  },
});
