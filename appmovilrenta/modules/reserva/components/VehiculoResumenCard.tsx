import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { COLORES } from "../constants/reserva.constants";

interface Props {
  vehiculo: Vehiculo;
}

function getSafeImages(vehiculo: Vehiculo): string[] {
  const imgs = vehiculo.imagenes ?? [];
  const filtradas = imgs.filter(Boolean);
  if (filtradas.length > 0) return filtradas.slice(0, 3);
  if (vehiculo.imagen) return [vehiculo.imagen];
  if (vehiculo.foto) return [vehiculo.foto];
  return [];
}

function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-CO")}`;
}

interface CaracteristicaItem {
  icono: React.ReactNode;
  label: string;
}

export default function VehiculoResumenCard({ vehiculo }: Props) {
  const [fotoActiva, setFotoActiva] = useState(0);
  const imagenes = getSafeImages(vehiculo);

  const specs: CaracteristicaItem[] = [
    { icono: <Ionicons name="settings-outline" size={14} color={COLORES.accentText} />, label: vehiculo.transmision ?? "—" },
    { icono: <MaterialCommunityIcons name="gas-station-outline" size={14} color={COLORES.accentText} />, label: vehiculo.combustible ?? "—" },
    { icono: <Ionicons name="people-outline" size={14} color={COLORES.accentText} />, label: `${vehiculo.pasajeros ?? 5} personas` },
  ];

  // Mismas 7 características que maneja VehiculoDetalles.tsx en el catálogo — nada extra,
  // solo se agregan las que el vehículo realmente tiene (chequeo condicional campo por campo).
  const caracteristicas: CaracteristicaItem[] = [];

  if (vehiculo.aireAcondicionado) {
    caracteristicas.push({ icono: <Ionicons name="snow-outline" size={14} color={COLORES.accentText} />, label: "Aire acondicionado" });
  }
  if (vehiculo.vidriosElectricos) {
    caracteristicas.push({ icono: <Ionicons name="flash-outline" size={14} color={COLORES.accentText} />, label: "Eleva vidrios eléctrico" });
  }
  if (vehiculo.cierreCentralizado) {
    caracteristicas.push({ icono: <Ionicons name="lock-closed-outline" size={14} color={COLORES.accentText} />, label: "Cierre centralizado" });
  }
  if (vehiculo.maletero) {
    caracteristicas.push({ icono: <MaterialCommunityIcons name="bag-suitcase-outline" size={14} color={COLORES.accentText} />, label: `${vehiculo.maletero}L maletero` });
  }
  if (vehiculo.transmision) {
    caracteristicas.push({ icono: <Ionicons name="settings-outline" size={14} color={COLORES.accentText} />, label: vehiculo.transmision });
  }
  if (vehiculo.combustible) {
    caracteristicas.push({ icono: <MaterialCommunityIcons name="gas-station-outline" size={14} color={COLORES.accentText} />, label: vehiculo.combustible });
  }
  if (vehiculo.pasajeros) {
    caracteristicas.push({ icono: <Ionicons name="people-outline" size={14} color={COLORES.accentText} />, label: `${vehiculo.pasajeros} personas` });
  }

  const filasCaracteristicas: CaracteristicaItem[][] = [];
  for (let i = 0; i < caracteristicas.length; i += 2) {
    filasCaracteristicas.push(caracteristicas.slice(i, i + 2));
  }

  return (
    <View style={styles.card}>
      <View style={styles.imagenPrincipal}>
        {imagenes.length > 0 ? (
          <>
            <Image
              source={{ uri: imagenes[fotoActiva] }}
              style={styles.imagenPrincipalImg}
              resizeMode="cover"
            />
            <View style={styles.badgeGaleria}>
              <Ionicons name="images-outline" size={11} color="#0f6e56" />
              <Text style={styles.badgeGaleriaText}>En galería</Text>
            </View>
          </>
        ) : (
          <View style={styles.imagenFallback}>
            <Ionicons name="car-outline" size={48} color={COLORES.imageFallbackIcon} />
          </View>
        )}
      </View>

      {imagenes.length > 1 && (
        <View style={styles.thumbsRow}>
          {imagenes.map((uri, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setFotoActiva(i)}
              activeOpacity={0.8}
              style={styles.thumbWrap}
            >
              <Image
                source={{ uri }}
                style={[styles.thumb, i === fotoActiva && styles.thumbActivo]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.separador} />

      <View style={styles.filaNombrePrecio}>
        <Text style={styles.nombre} numberOfLines={1}>{vehiculo.nombre}</Text>
        <Text style={styles.precio}>
          {formatPrecio(vehiculo.precio)}
          <Text style={styles.precioDia}>/día</Text>
        </Text>
      </View>

      <View style={styles.tagsRow}>
        <View style={styles.tagCategoria}>
          <Text style={styles.tagCategoriaText}>{vehiculo.categoria ?? "Económico"}</Text>
        </View>

        {vehiculo.sucursal && (
          <View style={styles.tagUbicacion}>
            <Ionicons name="location-outline" size={12} color="#166534" />
            <Text style={styles.tagUbicacionText} numberOfLines={1}>
              {vehiculo.sucursal}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.specsRow}>
        {specs.map((s, i) => (
          <View key={i} style={styles.specItem}>
            {s.icono}
            <Text style={styles.specText}>{s.label}</Text>
          </View>
        ))}
      </View>

      {filasCaracteristicas.length > 0 && (
        <>
          <Text style={styles.seccionLabel}>CARACTERÍSTICAS</Text>
          <View style={styles.caracteristicasGrid}>
            {filasCaracteristicas.map((fila, fi) => (
              <View key={fi} style={styles.caracteristicasFila}>
                {fila.map((item, ci) => (
                  <View key={ci} style={styles.caracteristicaChip}>
                    {item.icono}
                    <Text style={styles.caracteristicaChipText} numberOfLines={1}>{item.label}</Text>
                  </View>
                ))}
                {fila.length === 1 && <View style={styles.caracteristicaChipVacio} />}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORES.panelBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imagenPrincipal: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORES.imageFallbackBg,
  },
  imagenPrincipalImg: { width: "100%", height: "100%" },
  imagenFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  badgeGaleria: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeGaleriaText: { fontSize: 10, fontWeight: "700", color: "#0f6e56" },
  thumbsRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  thumbWrap: { flex: 1 },
  thumb: { width: "100%", height: 52, borderRadius: 8, opacity: 0.6 },
  thumbActivo: { opacity: 1, borderWidth: 2, borderColor: COLORES.accentText },
  separador: { height: 1, backgroundColor: COLORES.panelBorder, marginTop: 14, marginBottom: 14 },
  filaNombrePrecio: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 12,
  },
  nombre: { fontSize: 17, fontWeight: "800", color: COLORES.textPrimary, flex: 1 },
  precio: { fontSize: 17, fontWeight: "800", color: COLORES.textPrimary, textAlign: "right" },
  precioDia: { fontSize: 11, fontWeight: "400", color: COLORES.textSoft },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginBottom: 14,
  },
  tagCategoria: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  tagCategoriaText: { fontSize: 11, fontWeight: "700", color: "#1e40af" },
  tagUbicacion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    maxWidth: "70%",
  },
  tagUbicacionText: { fontSize: 11, fontWeight: "700", color: "#166534", flexShrink: 1 },
  specsRow: { flexDirection: "row", gap: 18 },
  specItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  specText: { fontSize: 12, fontWeight: "600", color: "#334155" },
  seccionLabel: { fontSize: 10, fontWeight: "700", color: COLORES.textMuted, letterSpacing: 0.4, marginTop: 18, marginBottom: 8 },
  caracteristicasGrid: { gap: 8 },
  caracteristicasFila: { flexDirection: "row", gap: 8 },
  caracteristicaChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  caracteristicaChipVacio: { flex: 1 },
  caracteristicaChipText: { fontSize: 12, fontWeight: "600", color: "#334155", flexShrink: 1 },
});