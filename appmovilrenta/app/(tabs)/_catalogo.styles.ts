import { StyleSheet } from "react-native";

const P = "#1D4ED8";

export const catalogoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  // Header
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  logo: {
    width: 120,
    height: 52,
  },
  // Búsqueda
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    padding: 0,
  },
  searchClear: {
    fontSize: 14,
    color: "#9CA3AF",
    paddingHorizontal: 4,
  },
  // Categorías
  catsRow: {
    maxHeight: 50,
    backgroundColor: "#FFFFFF",
  },
  catsContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  catChipActive: {
    backgroundColor: P,
    borderColor: P,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  catChipTextActive: {
    color: "#FFFFFF",
  },
  // Contador
  contadorWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  contadorText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  // Lista
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
    gap: 14,
  },
  // Tarjeta
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#F0F4FF",
  },
  cardBody: {
    padding: 14,
  },
  cardNombre: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  cardSubtitulo: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },
  cardChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  cardChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardChipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrecioWrap: {},
  cardEstadoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  cardEstadoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  cardEstadoText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardPrecio: {
    fontSize: 20,
    fontWeight: "800",
    color: P,
  },
  cardPrecioDia: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  cardBtns: {
    gap: 8,
    alignItems: "flex-end",
  },
  btnReservar: {
    backgroundColor: P,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnReservarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  btnReservarOff: {
    backgroundColor: "#9CA3AF",
  },
  btnDetalles: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  btnDetallesText: {
    fontSize: 12,
    fontWeight: "600",
    color: P,
    textDecorationLine: "underline",
  },
  // Empty state
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: P,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});