/**
 * RF5.6 — Mostrar mensajes incentivos al registro
 * RF5.9 — Redirigir registro al acceder funciones restringidas
 * RF5.10 — Mostrar alertas ventajas del registro
 */
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { VENTAJAS_REGISTRO } from "../hooks/useInvitado";

interface Props {
  visible: boolean;
  onRegistro: () => void;
  onLogin: () => void;
  onCerrar: () => void;
}

export function BannerRegistro({
  visible,
  onRegistro,
  onLogin,
  onCerrar,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCerrar}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Ícono */}
          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🔒</Text>
            </View>
          </View>

          {/* Título RF5.7 */}
          <Text style={styles.title}>Función exclusiva para miembros</Text>
          <Text style={styles.subtitle}>
            Para reservar un vehículo necesitas una cuenta. ¡Es gratis y toma
            menos de 2 minutos!
          </Text>

          {/* Ventajas RF5.10 */}
          <ScrollView
            style={styles.ventajasScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.ventajasTitle}>
              ¿Por qué crear una cuenta?
            </Text>
            <View style={styles.ventajasList}>
              {VENTAJAS_REGISTRO.map((v) => (
                <View key={v.titulo} style={styles.ventajaRow}>
                  <View style={styles.ventajaIconWrap}>
                    <Text style={styles.ventajaIcon}>{v.icon}</Text>
                  </View>
                  <View style={styles.ventajaTextos}>
                    <Text style={styles.ventajaTitulo}>{v.titulo}</Text>
                    <Text style={styles.ventajaDesc}>{v.descripcion}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Acciones RF5.9 */}
          <View style={styles.actions}>
            {/* Registrarse */}
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={onRegistro}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>CREAR CUENTA GRATIS</Text>
            </TouchableOpacity>

            {/* Ya tengo cuenta */}
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={onLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.btnSecondaryText}>Ya tengo cuenta</Text>
            </TouchableOpacity>

            {/* Seguir explorando */}
            <TouchableOpacity style={styles.btnText} onPress={onCerrar}>
              <Text style={styles.btnTextText}>Seguir explorando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  iconWrap: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#DBEAFE",
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  ventajasScroll: {
    maxHeight: 220,
  },
  ventajasTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  ventajasList: {
    gap: 10,
    marginBottom: 8,
  },
  ventajaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  ventajaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  ventajaIcon: {
    fontSize: 20,
  },
  ventajaTextos: {
    flex: 1,
  },
  ventajaTitulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  ventajaDesc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  btnSecondary: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1D4ED8",
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  btnText: {
    alignItems: "center",
    paddingVertical: 8,
  },
  btnTextText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});