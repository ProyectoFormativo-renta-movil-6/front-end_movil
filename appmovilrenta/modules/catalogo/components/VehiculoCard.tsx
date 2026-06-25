// modules/catalogo/components/VehiculoCard.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORES } from "../constants/catalogo.constants";
import { Vehiculo } from "../types/catalogo.types";

interface Props {
  vehiculo: Vehiculo;
  invitado?: boolean;
  esFavorito?: boolean; // Propiedad añadida para dinamismo
  onAccionRestringida?: (accion: "reservar" | "favorito") => void;
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

interface CaracteristicaProps {
  icono: React.ReactNode;
  label: string;
}

const Caracteristica = memo(function Caracteristica({
  icono,
  label,
}: CaracteristicaProps) {
  return (
    <View style={styles.caracteristicaItem}>
      {icono}
      <Text style={styles.caracteristicaText}>{label}</Text>
    </View>
  );
});

function VehiculoCard({
  vehiculo,
  invitado = true,
  esFavorito = false,
  onAccionRestringida,
}: Props) {
  const [fotoActiva, setFotoActiva] = useState(0);
  const [verDetalles, setVerDetalles] = useState(false);

  const imagenes = getSafeImages(vehiculo);
  const imagenActual = imagenes[fotoActiva] ?? null;
  const estadoDisponible = vehiculo.disponible !== false;
  const rating = Number(vehiculo.calificacion ?? 0);
  const estrellas = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  const tarifas = vehiculo.tarifas ?? {};
  const seguros = vehiculo.seguros ?? [];

  const handleReservar = () => {
    if (!estadoDisponible) return;
    if (invitado) {
      onAccionRestringida?.("reservar");
      return;
    }
    router.push("/(tabs)/reservar");
  };

  const handleFavorito = () => {
    if (invitado) {
      onAccionRestringida?.("favorito");
    } else {
      onAccionRestringida?.("favorito"); // Permite manejar la lógica arriba si no es invitado
    }
  };

  return (
    <View style={styles.card}>
      {/* IMAGEN */}
      <View style={styles.imagenContainer}>
        {imagenActual ? (
          <Image
            source={{ uri: imagenActual }}
            style={styles.imagen}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagenFallback}>
            <Ionicons
              name="car-outline"
              size={48}
              color={COLORES.imageFallbackIcon}
            />
          </View>
        )}

        {/* Badge disponibilidad */}
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

        {/* Botón favorito dinámico */}
        <TouchableOpacity style={styles.favBtn} onPress={handleFavorito}>
          <Ionicons
            name={esFavorito ? "heart" : "heart-outline"}
            size={18}
            color={esFavorito ? "#ef4444" : "#6B7280"}
          />
        </TouchableOpacity>

        {/* Dots navegación fotos */}
        {imagenes.length > 1 && (
          <View style={styles.dotsRow}>
            {imagenes.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setFotoActiva(i)}
                style={[styles.dot, i === fotoActiva && styles.dotActivo]}
              />
            ))}
          </View>
        )}
      </View>

      {/* CONTENIDO */}
      <View style={styles.contenido}>
        {/* Tags */}
        <View style={styles.tagsRow}>
          <View style={styles.tagCategoria}>
            <Text style={styles.tagCategoriaText}>
              {vehiculo.categoria ?? "Económico"}
            </Text>
          </View>
          <View style={styles.tagSucursal}>
            <Ionicons name="location-outline" size={10} color="#059669" />
            <Text style={styles.tagSucursalText}>
              {vehiculo.sucursal ?? "Centro"}
            </Text>
          </View>
        </View>

        {/* Nombre */}
        <Text style={styles.nombre}>{vehiculo.nombre}</Text>

        {/* Características principales */}
        <View style={styles.caracteristicasGrid}>
          <Caracteristica
            icono={<Ionicons name="snow-outline" size={13} color="#2f4ea2" />}
            label="Aire acondicionado"
          />
          <Caracteristica
            icono={
              <MaterialCommunityIcons
                name="car-door"
                size={13}
                color="#2f4ea2"
              />
            }
            label={`${vehiculo.puertas ?? 4} puertas`}
          />
          <Caracteristica
            icono={<Ionicons name="people-outline" size={13} color="#2f4ea2" />}
            label={`${vehiculo.pasajeros ?? 4} personas`}
          />
          <Caracteristica
            icono={
              <MaterialCommunityIcons
                name="bag-suitcase-outline"
                size={13}
                color="#2f4ea2"
              />
            }
            label={vehiculo.maletero ? `${vehiculo.maletero}L` : "Maletero"}
          />
          <Caracteristica
            icono={
              <Ionicons name="settings-outline" size={13} color="#2f4ea2" />
            }
            label={vehiculo.transmision}
          />
          <Caracteristica
            icono={
              <MaterialCommunityIcons
                name="gas-station-outline"
                size={13}
                color="#2f4ea2"
              />
            }
            label={vehiculo.combustible}
          />
        </View>

        {/* Estrellas */}
        <View style={styles.estrellasRow}>
          {estrellas.map((llena, i) => (
            <Estrella key={i} llena={llena} />
          ))}
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>

        {/* Precio */}
        <Text style={styles.precio}>
          {formatPrecio(vehiculo.precio)}
          <Text style={styles.precioDia}> /día</Text>
        </Text>

        {/* Botón reservar */}
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

        {/* Ver / ocultar detalles */}
        <TouchableOpacity
          style={styles.detallesBtn}
          onPress={() => setVerDetalles(!verDetalles)}
        >
          <Text style={styles.detallesBtnText}>
            {verDetalles ? "Ocultar detalles" : "Ver detalles"}
          </Text>
          <Ionicons
            name={verDetalles ? "chevron-up" : "chevron-down"}
            size={14}
            color="#2563eb"
          />
        </TouchableOpacity>

        {/* DETALLES EXPANDIBLES (Removido ScrollView anidado peligroso) */}
        {verDetalles && (
          <View style={{ marginTop: 6 }}>
            {/* TARIFAS */}
            <View style={styles.seccionDetalle}>
              <View style={styles.seccionDetalleHeader}>
                <Ionicons name="cash-outline" size={14} color="#137333" />
                <Text style={styles.seccionDetalleTitulo}>TARIFAS</Text>
              </View>
              {tarifas.kmLimitado && (
                <View style={styles.tarifaRow}>
                  <Text style={styles.tarifaLabel}>
                    Km limitado ({tarifas.kmLimitado.km} km/día)
                  </Text>
                  <Text style={styles.tarifaValor}>
                    {formatPrecio(tarifas.kmLimitado.precio)}
                  </Text>
                </View>
              )}
              {tarifas.kmIlimitado && (
                <View style={styles.tarifaRow}>
                  <Text style={styles.tarifaLabel}>Km ilimitado</Text>
                  <Text style={styles.tarifaValor}>
                    {formatPrecio(tarifas.kmIlimitado.precio)}
                  </Text>
                </View>
              )}
            </View>

            {/* SEGUROS */}
            <View
              style={[
                styles.seccionDetalle,
                { backgroundColor: "#f0f4ff", borderColor: "#ccd9ff" },
              ]}
            >
              <View style={styles.seccionDetalleHeader}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={14}
                  color="#1e40af"
                />
                <Text
                  style={[styles.seccionDetalleTitulo, { color: "#1e40af" }]}
                >
                  SEGUROS
                </Text>
              </View>
              {seguros.length > 0 ? (
                seguros.map((seg, i) => (
                  <View key={i} style={styles.tarifaRow}>
                    <Text style={styles.tarifaLabel}>{seg.nombre}</Text>
                    <Text style={styles.tarifaValor}>
                      {formatPrecio(seg.precio)}/día
                    </Text>
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.tarifaRow}>
                    <Text style={styles.tarifaLabel}>
                      Protección Obligatoria
                    </Text>
                    <Text style={styles.tarifaValor}>$29.000/día</Text>
                  </View>
                  <View style={styles.tarifaRow}>
                    <Text style={styles.tarifaLabel}>Protección Total</Text>
                    <Text style={styles.tarifaValor}>$67.000/día</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// Exportación optimizada con memo
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
  imagen: {
    width: "100%",
    height: "100%",
  },
  imagenFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e5e7eb",
  },
  dotActivo: {
    width: 16,
    backgroundColor: "#3b82f6",
  },
  contenido: {
    padding: 16,
  },
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
  tagCategoriaText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1e40af",
  },
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
  tagSucursalText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  nombre: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORES.textPrimary,
    marginBottom: 10,
  },
  caracteristicasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  caracteristicaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  caracteristicaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  estrellasRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 6,
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
  precioDia: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORES.textSoft,
  },
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
  reservarBtnDisabled: {
    backgroundColor: COLORES.paginationDisabledBg,
  },
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
  seccionDetalle: {
    backgroundColor: "#f4fbf7",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccf1dc",
    marginBottom: 10,
  },
  seccionDetalleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  seccionDetalleTitulo: {
    fontSize: 11,
    fontWeight: "800",
    color: "#137333",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tarifaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  tarifaLabel: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
    flex: 1,
  },
  tarifaValor: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1e3a8a",
  },
});
