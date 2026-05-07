/**
 * RF10 — Catálogo de vehículos
 * RF10.1: Listar vehículos registrados
 * RF10.2: Filtrar por marca
 * RF10.3: Filtrar por disponibilidad
 * RF10.5: Vista según rol usuario
 * RF10.6: Mensajes de visualización
 */
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCatalogo } from "@/modules/catalogo/hooks/useCatalogo";
import { CategoriaVehiculo, Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { catalogoStyles as styles } from "./_catalogo.styles";

const CATEGORIAS: CategoriaVehiculo[] = [
  "Todas",
  "SUVs",
  "Económicos",
  "Sedán",
  "Premium",
  "Van",
];

// ── Tarjeta de vehículo ───────────────────────────────────────────────────────
function VehiculoCard({
  v,
  onReservar,
  onDetalles,
}: {
  v: Vehiculo;
  onReservar: () => void;
  onDetalles: () => void;
}) {
  const estadoCfg = {
    disponible:    { color: "#16A34A", label: "Disponible" },
    reservado:     { color: "#DC2626", label: "Reservado" },
    mantenimiento: { color: "#D97706", label: "Mantenimiento" },
  }[v.estado];

  const disponible = v.estado === "disponible";

  return (
    <View style={styles.card}>
      {/* RF10.4 — Imagen del vehículo */}
      <Image
        source={v.imagen}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardBody}>
        {/* Nombre */}
        <Text style={styles.cardNombre}>
          {v.marca} {v.modelo}
        </Text>

        {/* Subtítulo */}
        <Text style={styles.cardSubtitulo}>
          {v.categoria} • {v.transmision === "automatica" ? "Automática" : "Mecánica"} • {v.combustible.charAt(0).toUpperCase() + v.combustible.slice(1)}
        </Text>

        {/* Chips de specs */}
        <View style={styles.cardChipsRow}>
          <View style={styles.cardChip}>
            <Text style={styles.cardChipText}>
              {v.capacidad} Plazas
            </Text>
          </View>
          {v.aireAcondicionado && (
            <View style={styles.cardChip}>
              <Text style={styles.cardChipText}>A/C</Text>
            </View>
          )}
          <View style={styles.cardChip}>
            <Text style={styles.cardChipText}>
              {v.kilometraje === "ilimitado" ? "Km ∞" : "Km limitado"}
            </Text>
          </View>
        </View>

        {/* Footer — precio + botones */}
        <View style={styles.cardFooter}>
          <View style={styles.cardPrecioWrap}>
            {/* RF10.3 — Estado disponibilidad */}
            <View style={styles.cardEstadoRow}>
              <View
                style={[
                  styles.cardEstadoDot,
                  { backgroundColor: estadoCfg.color },
                ]}
              />
              <Text
                style={[styles.cardEstadoText, { color: estadoCfg.color }]}
              >
                {estadoCfg.label}
              </Text>
            </View>
            <Text style={styles.cardPrecio}>
              ${v.precioDia.toLocaleString("es-CO")}
            </Text>
            <Text style={styles.cardPrecioDia}>/ día</Text>
          </View>

          <View style={styles.cardBtns}>
            {/* RF10.4 — Ver detalles — lo implementa la compañera */}
            <TouchableOpacity
              style={[
                styles.btnReservar,
                !disponible && styles.btnReservarOff,
              ]}
              onPress={disponible ? onReservar : undefined}
              activeOpacity={disponible ? 0.85 : 1}
            >
              <Text style={styles.btnReservarText}>
                {disponible ? "Reservar" : "No disponible"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnDetalles}
              onPress={onDetalles}
            >
              <Text style={styles.btnDetallesText}>VER DETALLES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function CatalogoScreen() {
  const insets = useSafeAreaInsets();
  const {
    vehiculos,
    totalVehiculos,
    filtros,
    actualizarFiltro,
    resetFiltros,
  } = useCatalogo();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header con logo */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* RF10.2 — Búsqueda por marca/categoría/ciudad */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar marca, categoría o ciudad..."
            placeholderTextColor="#9CA3AF"
            value={filtros.busqueda}
            onChangeText={(t) => actualizarFiltro("busqueda", t)}
            autoCapitalize="none"
          />
          {filtros.busqueda.length > 0 && (
            <TouchableOpacity onPress={() => actualizarFiltro("busqueda", "")}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* RF10.2 — Filtros por categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catsContent}
        style={styles.catsRow}
      >
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catChip,
              filtros.categoria === cat && styles.catChipActive,
            ]}
            onPress={() => actualizarFiltro("categoria", cat)}
          >
            <Text
              style={[
                styles.catChipText,
                filtros.categoria === cat && styles.catChipTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* RF10.6 — Contador resultados */}
      <View style={styles.contadorWrap}>
        <Text style={styles.contadorText}>
          {vehiculos.length} de {totalVehiculos} vehículos disponibles
        </Text>
      </View>

      {/* RF10.1 — Lista de vehículos / RF10.6 empty state */}
      {vehiculos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Sin resultados</Text>
          <Text style={styles.emptySub}>
            No encontramos vehículos con esos criterios de búsqueda.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={resetFiltros}>
            <Text style={styles.emptyBtnText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehiculos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VehiculoCard
              v={item}
              onReservar={() => {
                // RF11 — Reserva — próximo módulo
                console.log("Reservar:", item.id);
              }}
              onDetalles={() => {
                // RF10.4 — Detalle — lo implementa la compañera
                console.log("Detalles:", item.id);
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}