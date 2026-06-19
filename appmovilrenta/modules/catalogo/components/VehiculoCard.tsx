// modules/catalogo/components/VehiculoCard.tsx

import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Vehiculo } from "../types/catalogo.types";
import { BannerRegistro } from "./BannerRegistro";

interface VehiculoCardProps {
  vehiculo: Vehiculo;
  invitado: boolean;
  esFavorito?: boolean;
  onToggleFavorito?: (vehiculoId: string) => void;
}

export function VehiculoCard({
  vehiculo,
  invitado,
  esFavorito = false,
  onToggleFavorito,
}: VehiculoCardProps) {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [mensajeBanner, setMensajeBanner] = useState("");

  const handleReservar = () => {
    if (invitado) {
      setMensajeBanner(
        "Para reservar un vehículo necesitas tener una cuenta. ¡Es rápido y gratis!",
      );
      setBannerVisible(true);
      return;
    }
    if (!vehiculo.disponible) {
      Alert.alert(
        "No disponible",
        "Este vehículo no está disponible por el momento.",
      );
      return;
    }
    Alert.alert(
      "Detalle",
      `Vehículo: ${vehiculo.nombre}\nPróximamente disponible.`,
    );
  };

  const handleFavorito = () => {
    if (invitado) {
      Alert.alert(
        "Inicia sesión",
        "Para guardar favoritos necesitas una cuenta registrada.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Ir al login", onPress: () => router.push("/(auth)/login") },
        ],
      );
      return;
    }
    onToggleFavorito?.(vehiculo.id);
  };

  const precioFormateado = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(vehiculo.precio);

  return (
    <>
      <View
        style={[styles.card, !vehiculo.disponible && styles.cardNoDisponible]}
      >
        {/* Imagen */}
        <View style={styles.imagenContainer}>
          <Image
            source={{ uri: vehiculo.imagen }}
            style={styles.imagen}
            resizeMode="cover"
          />
          {/* Badge disponibilidad */}
          <View
            style={[
              styles.badge,
              vehiculo.disponible
                ? styles.badgeDisponible
                : styles.badgeNoDisponible,
            ]}
          >
            <Text style={styles.badgeTexto}>
              {vehiculo.disponible ? "Disponible" : "No disponible"}
            </Text>
          </View>

          {/* Botón favorito */}
          <TouchableOpacity style={styles.favoritoBtn} onPress={handleFavorito}>
            <Text style={styles.favoritoIcono}>{esFavorito ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>

        {/* Contenido */}
        <View style={styles.contenido}>
          {/* Categoría */}
          <View style={styles.categoriaChip}>
            <Text style={styles.categoriaTexto}>{vehiculo.categoria}</Text>
          </View>

          {/* Nombre */}
          <Text style={styles.nombre} numberOfLines={2}>
            {vehiculo.nombre}
          </Text>

          {/* Info rápida */}
          <View style={styles.infoRow}>
            <Text style={styles.infoItem}>⚙️ {vehiculo.transmision}</Text>
            <Text style={styles.infoItem}>⛽ {vehiculo.combustible}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoItem}>
              👤 {vehiculo.pasajeros ?? 5} pas.
            </Text>
            <Text style={styles.infoItem} numberOfLines={1}>
              📍 {vehiculo.sucursal.split("(")[0].trim()}
            </Text>
          </View>

          {/* Precio y botón */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.precioPor}>por día</Text>
              <Text style={styles.precio}>{precioFormateado}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.botonReservar,
                !vehiculo.disponible && styles.botonReservarDeshabilitado,
              ]}
              onPress={handleReservar}
              disabled={false} // No deshabilitar: invitado ve el botón pero activa banner
            >
              <Text style={styles.botonReservarTexto}>
                {invitado ? "Ver más" : "Reservar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Banner de registro (solo invitado) */}
      <BannerRegistro
        visible={bannerVisible}
        onCerrar={() => setBannerVisible(false)}
        mensaje={mensajeBanner}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardNoDisponible: {
    opacity: 0.75,
  },
  imagenContainer: {
    position: "relative",
    height: 160,
  },
  imagen: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeDisponible: {
    backgroundColor: "#22C55E",
  },
  badgeNoDisponible: {
    backgroundColor: "#EF4444",
  },
  badgeTexto: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  favoritoBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  favoritoIcono: {
    fontSize: 18,
  },
  contenido: {
    padding: 14,
    gap: 6,
  },
  categoriaChip: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoriaTexto: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "600",
  },
  nombre: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoItem: {
    fontSize: 12,
    color: "#64748B",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  precioPor: {
    fontSize: 11,
    color: "#94A3B8",
  },
  precio: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2563EB",
  },
  botonReservar: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  botonReservarDeshabilitado: {
    backgroundColor: "#94A3B8",
  },
  botonReservarTexto: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
