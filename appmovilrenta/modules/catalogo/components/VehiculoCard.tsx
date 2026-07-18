// modules/catalogo/components/VehiculoCard.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useState } from "react";
import { useReservaStore } from "@/store/reservaStore";
import { DatosFechasLugar } from "@/modules/reserva/types/reserva.types";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORES } from "../constants/catalogo.constants";
import { Vehiculo } from "../types/catalogo.types";
import VehiculoDetalles from "./VehiculoDetalles";

interface Props {
  vehiculo: Vehiculo;
  invitado?: boolean;
  esFavorito?: boolean;
  onAccionRestringida?: (accion: "reservar" | "favorito") => void;
  onToggleFavorito?: (id: number) => void;
  // Viene de una búsqueda previa en "Consultar disponibilidad". Si el
  // usuario no buscó nada, llega undefined y la reserva arranca vacía.
  datosPrecarga?: Partial<Pick<DatosFechasLugar, "lugarRetiro" | "fechaRetiro" | "fechaDevolucion">>;
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

function Estrella({ llena }: { llena: boolean }) {
  return (
    <Ionicons
      name={llena ? "star" : "star-outline"}
      size={13}
      color={llena ? "#f59e0b" : "#d1d5db"}
    />
  );
}

function VehiculoCard({
  vehiculo,
  invitado = true,
  esFavorito = false,
  onAccionRestringida,
  onToggleFavorito,
  datosPrecarga,
}: Props) {
  const [fotoActiva, setFotoActiva] = useState(0);
  const [verDetalles, setVerDetalles] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  const imagenes = getSafeImages(vehiculo);
  const estadoDisponible = vehiculo.disponible !== false;
  const rating = Number(vehiculo.calificacion ?? 0);
  const estrellas = Array.from(
    { length: 5 },
    (_, i) => i < Math.round(rating)
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const width = e.nativeEvent.layoutMeasurement.width;
    if (width > 0) setFotoActiva(Math.round(x / width));
  };

  const handleReservar = () => {
    if (!estadoDisponible) return;
    if (invitado) {
      onAccionRestringida?.("reservar");
      return;
    }
    useReservaStore.getState().seleccionarVehiculo(vehiculo, datosPrecarga);
    router.push("/(tabs)/reservar");
  };

  const handleFavorito = () => {
    if (invitado) {
      onAccionRestringida?.("favorito");
      return;
    }
    onToggleFavorito?.(vehiculo.id);
  };

  return (
    <View style={styles.card}>
      <View
        style={styles.imagenContainer}
        onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
      >
        {cardWidth > 0 && imagenes.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ width: cardWidth, height: 190 }}
            contentContainerStyle={{ flexDirection: "row" }}
          >
            {imagenes.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={{ width: cardWidth, height: 190 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : cardWidth > 0 ? (
          <View style={styles.imagenFallback}>
            <Ionicons
              name="car-outline"
              size={48}
              color={COLORES.imageFallbackIcon}
            />
          </View>
        ) : null}

        <View
          style={[
            styles.badge,
            { backgroundColor: estadoDisponible ? "#e6f4ea" : "#fce8e6" },
          ]}
        >
          <View
            style={[
              styles.badgeDot,
              { backgroundColor: estadoDisponible ? "#137333" : "#c5221f" },
            ]}
          />
          <Text
            style={[
              styles.badgeText,
              { color: estadoDisponible ? "#137333" : "#c5221f" },
            ]}
          >
            {estadoDisponible ? "Disponible" : "No disponible"}
          </Text>
        </View>

        <TouchableOpacity style={styles.favBtn} onPress={handleFavorito}>
          <Ionicons
            name={esFavorito ? "heart" : "heart-outline"}
            size={18}
            color={esFavorito ? COLORES.accentText : "#6B7280"}
          />
        </TouchableOpacity>

        {imagenes.length > 1 && (
          <View style={styles.dotsRow}>
            {imagenes.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === fotoActiva && styles.dotActivo]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.contenido}>
        {!verDetalles && (
          <View>
            <View style={styles.tagsRow}>
              <View style={styles.tagCategoria}>
                <Text style={styles.tagCategoriaText}>
                  {vehiculo.categoria ?? "Economico"}
                </Text>
              </View>
              <View style={styles.tagSucursal}>
                <Ionicons name="location-outline" size={10} color="#059669" />
                <Text style={styles.tagSucursalText}>
                  {vehiculo.sucursal ?? "Centro"}
                </Text>
              </View>
            </View>

            <Text style={styles.nombre}>{vehiculo.nombre}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="settings-outline" size={14} color="#2f4ea2" />
                <Text style={styles.infoText}>{vehiculo.transmision}</Text>
              </View>
              <View style={styles.infoSeparador} />
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="gas-station-outline"
                  size={14}
                  color="#2f4ea2"
                />
                <Text style={styles.infoText}>{vehiculo.combustible}</Text>
              </View>
            </View>

            <View style={styles.estrellasRow}>
              {estrellas.map((llena, i) => (
                <Estrella key={i} llena={llena} />
              ))}
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>

            <Text style={styles.precio}>
              {formatPrecio(vehiculo.precio)}
              <Text style={styles.precioDia}> /dia</Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.reservarBtn,
                !estadoDisponible && styles.reservarBtnDisabled,
              ]}
              onPress={handleReservar}
              disabled={!estadoDisponible}
            >
              <Ionicons name="car-sport-outline" size={16} color="#fff" />
              <Text style={styles.reservarBtnText}>RESERVAR AHORA</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.detallesBtn}
          onPress={() => setVerDetalles(!verDetalles)}
        >
          <Text style={styles.detallesBtnText}>
            {verDetalles ? "Ocultar detalles" : "Ver detalles"}
          </Text>
        </TouchableOpacity>

        {verDetalles && <VehiculoDetalles vehiculo={vehiculo} />}
      </View>
    </View>
  );
}

export default memo(VehiculoCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORES.panelBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORES.cardBorder,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imagenContainer: {
    height: 190,
    backgroundColor: COLORES.imageFallbackBg,
    position: "relative",
  },
  imagenFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  dotsRow: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#e5e7eb" },
  dotActivo: { width: 16, backgroundColor: "#3b82f6" },
  contenido: { padding: 16 },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 8,
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
  tagSucursal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  tagSucursalText: { fontSize: 11, fontWeight: "700", color: "#059669" },
  nombre: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORES.textPrimary,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  infoText: { fontSize: 13, fontWeight: "600", color: "#334155" },
  infoSeparador: { width: 1, height: 14, backgroundColor: "#CBD5E1" },
  estrellasRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: COLORES.textSecondary,
    fontWeight: "600",
    marginLeft: 4,
  },
  precio: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1e3a8a",
    marginBottom: 12,
  },
  precioDia: { fontSize: 14, fontWeight: "400", color: COLORES.textSoft },
  reservarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2f4ea2",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  reservarBtnDisabled: { backgroundColor: COLORES.paginationDisabledBg },
  reservarBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  detallesBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    marginBottom: 4,
  },
  detallesBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563eb",
    textDecorationLine: "underline",
  },
});