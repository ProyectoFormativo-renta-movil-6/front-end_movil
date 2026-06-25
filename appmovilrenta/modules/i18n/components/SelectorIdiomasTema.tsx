/**
 * RF28 — Cambio de idioma y tema
 * Componente reutilizable — se usa en:
 * 1. Onboarding screen 1
 * 2. Pantalla de perfil
 */
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { IdiomaKey, IDIOMAS } from "../index";
import { useIdioma } from "../hooks/useIdioma";

interface Props {
  mostrarTitulo?: boolean;
}

export function SelectorIdiomasTema({ mostrarTitulo = true }: Props) {
  const { t } = useTranslation();
  const { idiomaActual, cambiarIdioma, temaActual, cambiarTema } = useIdioma();
  const [modalIdioma, setModalIdioma] = useState(false);

  return (
    <View style={styles.container}>
      {mostrarTitulo && (
        <Text style={styles.titulo}>⚙️ Configuración</Text>
      )}

      {/* Selector de tema */}
      <View style={styles.seccion}>
        <Text style={styles.seccionLabel}>{t("config.tema")}</Text>
        <View style={styles.temaRow}>
          <TouchableOpacity
            style={[
              styles.temaBtn,
              temaActual === "claro" && styles.temaBtnActive,
            ]}
            onPress={() => cambiarTema("claro")}
            activeOpacity={0.85}
          >
            <Text style={styles.temaBtnText}>{t("config.claro")}</Text>
            {temaActual === "claro" && (
              <View style={styles.temaCheck}>
                <Text style={styles.temaCheckText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.temaBtn,
              temaActual === "oscuro" && styles.temaBtnActiveDark,
            ]}
            onPress={() => cambiarTema("oscuro")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.temaBtnText,
                temaActual === "oscuro" && styles.temaBtnTextDark,
              ]}
            >
              {t("config.oscuro")}
            </Text>
            {temaActual === "oscuro" && (
              <View style={[styles.temaCheck, styles.temaCheckDark]}>
                <Text style={styles.temaCheckText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Selector de idioma */}
      <View style={styles.seccion}>
        <Text style={styles.seccionLabel}>{t("config.idioma")}</Text>
        <TouchableOpacity
          style={styles.idiomaBtn}
          onPress={() => setModalIdioma(true)}
          activeOpacity={0.85}
        >
          <View style={styles.idiomaActualWrap}>
            <Text style={styles.idiomaFlag}>
              {IDIOMAS[idiomaActual].flag}
            </Text>
            <Text style={styles.idiomaLabel}>
              {IDIOMAS[idiomaActual].label}
            </Text>
          </View>
          <Text style={styles.idiomaArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Modal selección de idioma */}
      <Modal
        visible={modalIdioma}
        transparent
        animationType="slide"
        onRequestClose={() => setModalIdioma(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitulo}>{t("config.idioma")}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {(Object.keys(IDIOMAS) as IdiomaKey[]).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.idiomaOption,
                    idiomaActual === key && styles.idiomaOptionActive,
                  ]}
                  onPress={() => {
                    cambiarIdioma(key);
                    setModalIdioma(false);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.idiomaOptionFlag}>
                    {IDIOMAS[key].flag}
                  </Text>
                  <Text
                    style={[
                      styles.idiomaOptionLabel,
                      idiomaActual === key && styles.idiomaOptionLabelActive,
                    ]}
                  >
                    {IDIOMAS[key].label}
                  </Text>
                  {idiomaActual === key && (
                    <View style={styles.idiomaOptionCheck}>
                      <Text style={styles.idiomaOptionCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalBtnCerrar}
              onPress={() => setModalIdioma(false)}
            >
              <Text style={styles.modalBtnCerrarText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  titulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  seccion: {
    marginBottom: 12,
  },
  seccionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D4ED8",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  // Tema
  temaRow: {
    flexDirection: "row",
    gap: 10,
  },
  temaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    position: "relative",
  },
  temaBtnActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#1D4ED8",
  },
  temaBtnActiveDark: {
    backgroundColor: "#1C2330",
    borderColor: "#4A5568",
  },
  temaBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  temaBtnTextDark: {
    color: "#F0F4FF",
  },
  temaCheck: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
  },
  temaCheckDark: {
    backgroundColor: "#4A5568",
  },
  temaCheckText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  // Idioma
  idiomaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  idiomaActualWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  idiomaFlag: { fontSize: 22 },
  idiomaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  idiomaArrow: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "android" ? 32 : 20,
    maxHeight: "70%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  idiomaOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  idiomaOptionActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#1D4ED8",
  },
  idiomaOptionFlag: { fontSize: 24 },
  idiomaOptionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  idiomaOptionLabelActive: {
    color: "#1D4ED8",
  },
  idiomaOptionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
  },
  idiomaOptionCheckText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  modalBtnCerrar: {
    marginTop: 12,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnCerrarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
});