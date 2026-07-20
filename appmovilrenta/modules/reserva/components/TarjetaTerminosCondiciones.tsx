// modules/reserva/components/TarjetaTerminosCondiciones.tsx
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  COLOR_MARCA,
  COLORES,
  PUNTOS_POLITICA,
  RESUMEN_POLITICAS_IMPORTANTES,
} from "../constants/reserva.constants";
import { GRADIENTES } from "@/constants/gradients";
import { useReservaStore } from "@/store/reservaStore";

export default function TarjetaTerminosCondiciones() {
  const datosPersonales = useReservaStore((s) => s.datosPersonales);
  const actualizarDatosPersonales = useReservaStore((s) => s.actualizarDatosPersonales);
  const [verTerminos, setVerTerminos] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.filaCheckbox}>
        <TouchableOpacity
          style={[styles.checkbox, datosPersonales.terminosAceptados && styles.checkboxMarcado]}
          onPress={() => actualizarDatosPersonales({ terminosAceptados: !datosPersonales.terminosAceptados })}
          hitSlop={6}
        >
          {datosPersonales.terminosAceptados && <Ionicons name="checkmark" size={13} color="#fff" />}
        </TouchableOpacity>
        <Text style={styles.textoCheckbox}>
          Autorizo el tratamiento de mis datos personales conforme a la{" "}
          <Text style={styles.enlace}>política de privacidad</Text> *
        </Text>
      </View>

      <TouchableOpacity style={styles.botonToggle} onPress={() => setVerTerminos((v) => !v)} activeOpacity={0.7}>
        <Ionicons name={verTerminos ? "chevron-down" : "chevron-forward"} size={13} color={COLOR_MARCA} />
        <Text style={styles.botonToggleTexto}>
          {verTerminos ? "Ocultar términos y condiciones" : "Ver términos y condiciones"}
        </Text>
      </TouchableOpacity>

      {verTerminos && (
        <View style={styles.panelTerminos}>
          <LinearGradient
            colors={GRADIENTES.panel.colors}
            start={GRADIENTES.panel.start}
            end={GRADIENTES.panel.end}
            style={styles.panelHeader}
          >
            <Text style={styles.panelHeaderTitulo}>POLÍTICAS IMPORTANTES</Text>
            <Text style={styles.panelHeaderTexto}>{RESUMEN_POLITICAS_IMPORTANTES}</Text>
          </LinearGradient>

          <View style={styles.panelCuerpo}>
            {PUNTOS_POLITICA.map((punto) => (
              <View key={punto.titulo} style={styles.puntoBloque}>
                <Text style={styles.puntoTitulo}>{punto.titulo}</Text>
                {punto.items.map((item) => (
                  <Text key={item} style={styles.puntoItem}>
                    {"\u2022 "}
                    {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORES.panelBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  filaCheckbox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.3,
    borderColor: COLOR_MARCA,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxMarcado: {
    backgroundColor: COLOR_MARCA,
  },
  textoCheckbox: {
    flex: 1,
    fontSize: 12.5,
    color: COLORES.textPrimary,
    lineHeight: 18,
  },
  enlace: {
    color: COLOR_MARCA,
    fontWeight: "700",
  },
  botonToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 14,
    marginLeft: 28,
  },
  botonToggleTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: COLOR_MARCA,
  },
  panelTerminos: {
    marginTop: 14,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.3,
    borderColor: COLOR_MARCA,
  },
  panelHeader: {
    padding: 14,
  },
  panelHeaderTitulo: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  panelHeaderTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 17,
  },
  panelCuerpo: {
    backgroundColor: "#f8fafc",
    padding: 14,
  },
  puntoBloque: {
    marginBottom: 12,
  },
  puntoTitulo: {
    fontSize: 11.5,
    fontWeight: "800",
    color: COLORES.textPrimary,
    marginBottom: 4,
  },
  puntoItem: {
    fontSize: 11.5,
    color: COLORES.textSecondary,
    lineHeight: 17,
    marginBottom: 2,
  },
});