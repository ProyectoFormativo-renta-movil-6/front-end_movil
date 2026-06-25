import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contenedor: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
    justifyContent: "center",
  },

  // ── Encabezado ──────────────────────────────────────────────
  encabezado: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },

  // ── Banner error ─────────────────────────────────────────────
  bannerError: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  bannerErrorTexto: {
    color: "#991B1B",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Formulario ───────────────────────────────────────────────
  formulario: {
    marginBottom: 8,
  },
  enlaceOlvide: {
    alignSelf: "flex-end",
    marginTop: -6,
    marginBottom: 4,
    paddingVertical: 4,
  },
  textoEnlace: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Acciones ─────────────────────────────────────────────────
  acciones: {
    marginTop: 8,
  },
  separador: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    gap: 10,
  },
  lineaSeparador: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  textoSeparador: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
  },

  // ── Hint de bloqueo ──────────────────────────────────────────
  hintBloqueado: {
    fontSize: 12,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
});
