import React from "react";
import {
  FlatList,
  Image,
  Platform,
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
  "Todas", "SUVs", "Económicos", "Sedán", "Premium", "Van",
];

function VehiculoCard({
  v, onReservar, onDetalles,
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
      <Image
        source={v.imagen}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <Text
          style={styles.cardNombre}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {v.marca} {v.modelo}
        </Text>
        <Text style={styles.cardSubtitulo} numberOfLines={1}>
          {v.categoria} •{" "}
          {v.transmision === "automatica" ? "Automática" : "Mecánica"} •{" "}
          {v.combustible.charAt(0).toUpperCase() + v.combustible.slice(1)}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardChipsRow}
        >
          <View style={styles.cardChip}>
            <Text style={styles.cardChipText}>{v.capacidad} Plazas</Text>
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
        </ScrollView>
        <View style={styles.cardFooter}>
          <View style={styles.cardPrecioWrap}>
            <View style={styles.cardEstadoRow}>
              <View style={[styles.cardEstadoDot, { backgroundColor: estadoCfg.color }]} />
              <Text style={[styles.cardEstadoText, { color: estadoCfg.color }]}>
                {estadoCfg.label}
              </Text>
            </View>
            <Text style={styles.cardPrecio} adjustsFontSizeToFit minimumFontScale={0.8}>
              ${v.precioDia.toLocaleString("es-CO")}
            </Text>
            <Text style={styles.cardPrecioDia}>/ día</Text>
          </View>
          <View style={styles.cardBtns}>
            <TouchableOpacity
              style={[styles.btnReservar, !disponible && styles.btnReservarOff]}
              onPress={disponible ? onReservar : undefined}
              activeOpacity={disponible ? 0.85 : 1}
            >
              <Text style={styles.btnReservarText}>
                {disponible ? "Reservar" : "No disponible"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnDetalles} onPress={onDetalles}>
              <Text style={styles.btnDetallesText}>VER DETALLES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function CatalogoScreen() {
  const insets = useSafeAreaInsets();
  const { vehiculos, totalVehiculos, filtros, actualizarFiltro, resetFiltros } = useCatalogo();

  // ── Header completo como componente del FlatList ──────────────────────────
  const ListHeader = () => (
    <View>
      {/* Logo */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Búsqueda */}
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

      {/* Categorías */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catsContent}
        style={styles.catsRow}
      >
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, filtros.categoria === cat && styles.catChipActive]}
            onPress={() => actualizarFiltro("categoria", cat)}
          >
            <Text style={[styles.catChipText, filtros.categoria === cat && styles.catChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contador */}
      <View style={styles.contadorWrap}>
        <Text style={styles.contadorText}>
          {vehiculos.length} de {totalVehiculos} vehículos disponibles
        </Text>
      </View>
    </View>
  );

  // ── Empty state ───────────────────────────────────────────────────────────
  const ListEmpty = () => (
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
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VehiculoCard
            v={item}
            onReservar={() => console.log("Reservar RF46:", item.id)}
            onDetalles={() => console.log("Detalles RF45.4:", item.id)}
          />
        )}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === "android" ? 90 : 40 },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === "android"}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}