// modules/reserva/components/CampoSubidaDocumento.tsx
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_MARCA, COLORES } from "../constants/reserva.constants";
import { ArchivoDocumento } from "../types/reserva.types";

interface Props {
  etiqueta: string;
  ayuda: string;
  archivo: ArchivoDocumento | null;
  cargando: boolean;
  error?: string;
  onSeleccionar: () => void;
  onQuitar: () => void;
  requerido?: boolean;
}

export default function CampoSubidaDocumento({
  etiqueta,
  ayuda,
  archivo,
  cargando,
  error,
  onSeleccionar,
  onQuitar,
  requerido = true,
}: Props) {
  return (
    <View style={[styles.subcard, !!error && styles.subcardError]}>
      <Text style={styles.etiqueta}>
        {etiqueta}
        {requerido ? " *" : ""}
      </Text>
      <Text style={styles.ayuda}>{ayuda}</Text>

      {cargando ? (
        <View style={styles.estadoCargando}>
          <ActivityIndicator size="small" color={COLOR_MARCA} />
          <Text style={styles.textoCargando}>Subiendo archivo...</Text>
        </View>
      ) : archivo ? (
        <View style={styles.archivoBox}>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLOR_MARCA} />
          <View style={styles.archivoInfo}>
            <Text style={styles.archivoNombre} numberOfLines={1}>
              {archivo.nombre}
            </Text>
            <Text style={styles.archivoTamano}>{(archivo.tamanoBytes / 1024 / 1024).toFixed(2)} MB</Text>
          </View>
          <TouchableOpacity onPress={onQuitar} hitSlop={8}>
            <Ionicons name="close-outline" size={20} color={COLORES.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.boton} onPress={onSeleccionar} activeOpacity={0.7}>
          <Ionicons name="cloud-upload-outline" size={16} color={COLOR_MARCA} />
          <Text style={styles.botonTexto}>Subir PDF</Text>
        </TouchableOpacity>
      )}

      {!!error && (
        <View style={styles.errorFila}>
          <Ionicons name="alert-circle-outline" size={14} color={COLORES.textPrimary} />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Borde azul de marca, igual que los inputs de "Datos personales"
  subcard: {
    borderWidth: 1.3,
    borderStyle: "dashed",
    borderColor: COLOR_MARCA,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    backgroundColor: COLORES.panelBg,
  },
  // Antes rojo — ahora se distingue con borde sólido (no dashed) y un
  // poco más grueso, usando el mismo azul de marca de siempre
  subcardError: {
    borderStyle: "solid",
    borderWidth: 1.5,
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORES.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  ayuda: {
    fontSize: 10.5,
    color: COLORES.textMuted,
    textAlign: "center",
    lineHeight: 14,
    marginBottom: 12,
  },
  boton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  botonTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: COLOR_MARCA,
  },
  estadoCargando: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textoCargando: {
    fontSize: 12,
    fontWeight: "700",
    color: COLOR_MARCA,
  },
  // Antes fondo/borde verde — ahora usa el mismo azul suave que
  // "prefijoBox" en FormDatosPersonales.tsx, para quedar dentro de
  // la misma paleta que ya se usa en toda la app
  archivoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    backgroundColor: "#eef2fb",
    borderWidth: 1,
    borderColor: COLOR_MARCA,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  archivoInfo: { flex: 1, minWidth: 0 },
  archivoNombre: { fontSize: 11.5, fontWeight: "700", color: COLORES.textPrimary },
  archivoTamano: { fontSize: 10, color: COLORES.textSecondary },
  errorFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  // Antes rojo — ahora textPrimary en negrita, se apoya en el ícono
  // de alerta (también neutro) para comunicar el error sin usar rojo
  error: {
    fontSize: 10.5,
    color: COLORES.textPrimary,
    fontWeight: "700",
  },
});