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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const ventajas = [
    { icon: "📅", tituloKey: "auth.invitado.ventaja1Titulo", descKey: "auth.invitado.ventaja1Desc" },
    { icon: "💳", tituloKey: "auth.invitado.ventaja2Titulo", descKey: "auth.invitado.ventaja2Desc" },
    { icon: "📄", tituloKey: "auth.invitado.ventaja3Titulo", descKey: "auth.invitado.ventaja3Desc" },
    { icon: "🔔", tituloKey: "auth.invitado.ventaja4Titulo", descKey: "auth.invitado.ventaja4Desc" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCerrar}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🔒</Text>
            </View>
          </View>

          <Text style={styles.title}>{t("auth.invitado.bannerTitulo")}</Text>
          <Text style={styles.subtitle}>{t("auth.invitado.bannerSubtitulo")}</Text>

          <ScrollView style={styles.ventajasScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.ventajasTitle}>{t("auth.invitado.bannerPorQue")}</Text>
            <View style={styles.ventajasList}>
              {ventajas.map(({ icon, tituloKey, descKey }) => (
                <View key={tituloKey} style={styles.ventajaRow}>
                  <View style={styles.ventajaIconWrap}>
                    <Text style={styles.ventajaIcon}>{icon}</Text>
                  </View>
                  <View style={styles.ventajaTextos}>
                    <Text style={styles.ventajaTitulo}>{t(tituloKey)}</Text>
                    <Text style={styles.ventajaDesc}>{t(descKey)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnPrimary} onPress={onRegistro} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>{t("auth.invitado.bannerBtnCrear")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={onLogin} activeOpacity={0.85}>
              <Text style={styles.btnSecondaryText}>{t("auth.invitado.bannerBtnTengo")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnText} onPress={onCerrar}>
              <Text style={styles.btnTextText}>{t("auth.invitado.bannerBtnExplorar")}</Text>
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