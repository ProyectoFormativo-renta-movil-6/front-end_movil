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
import { useTranslation } from "react-i18next";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
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
  const { t } = useTranslation();
  const c = useTemaColores();
  const estadoCfg = {
    disponible:    { color: "#16A34A", label: t("catalogo.estados.disponible") },
    reservado:     { color: "#DC2626", label: t("catalogo.estados.reservado") },
    mantenimiento: { color: "#D97706", label: t("catalogo.estados.mantenimiento") },
  }[v.estado];

  const disponible = v.estado === "disponible";

  return (
    <View style={[styles.card, { backgroundColor: c.bgCard, borderColor: c.border }]}>
      <Image source={v.imagen} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardBody}>
        <Text style={[styles.cardNombre, { color: c.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {v.marca} {v.modelo}
        </Text>
        <Text style={[styles.cardSubtitulo, { color: c.textSecondary }]} numberOfLines={1}>
          {v.categoria} •{" "}
          {v.transmision === "automatica" ? t("catalogo.transmisionAutomatica") : t("catalogo.transmisionMecanica")} •{" "}
          {v.combustible.charAt(0).toUpperCase() + v.combustible.slice(1)}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardChipsRow}>
          <View style={[styles.cardChip, { backgroundColor: c.bgInput, borderColor: c.border }]}>
            <Text style={[styles.cardChipText, { color: c.textSecondary }]}>{v.capacidad} {t("catalogo.plazas")}</Text>
          </View>
          {v.aireAcondicionado && (
            <View style={[styles.cardChip, { backgroundColor: c.bgInput, borderColor: c.border }]}>
              <Text style={[styles.cardChipText, { color: c.textSecondary }]}>A/C</Text>
            </View>
          )}
          <View style={[styles.cardChip, { backgroundColor: c.bgInput, borderColor: c.border }]}>
            <Text style={[styles.cardChipText, { color: c.textSecondary }]}>
              {v.kilometraje === "ilimitado" ? "Km ∞" : t("auth.invitado.kmLimitado")}
            </Text>
          </View>
        </ScrollView>
        <View style={styles.cardFooter}>
          <View style={styles.cardPrecioWrap}>
            <View style={styles.cardEstadoRow}>
              <View style={[styles.cardEstadoDot, { backgroundColor: estadoCfg.color }]} />
              <Text style={[styles.cardEstadoText, { color: estadoCfg.color }]}>{estadoCfg.label}</Text>
            </View>
            <Text style={styles.cardPrecio} adjustsFontSizeToFit minimumFontScale={0.8}>
              ${v.precioDia.toLocaleString("es-CO")}
            </Text>
            <Text style={[styles.cardPrecioDia, { color: c.textMuted }]}>{t("catalogo.copDia")}</Text>
          </View>
          <View style={styles.cardBtns}>
            <TouchableOpacity
              style={[styles.btnReservar, !disponible && styles.btnReservarOff]}
              onPress={disponible ? onReservar : undefined}
              activeOpacity={disponible ? 0.85 : 1}
            >
              <Text style={styles.btnReservarText}>
                {disponible ? t("catalogo.reservar") : t("catalogo.noDisponible")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnDetalles} onPress={onDetalles}>
              <Text style={styles.btnDetallesText}>{t("catalogo.verDetalles")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function CatalogoScreen() {
  const { t } = useTranslation();
  const c = useTemaColores();
  const insets = useSafeAreaInsets();
  const { vehiculos, totalVehiculos, filtros, actualizarFiltro, resetFiltros } = useCatalogo();

  const CATEGORIA_LABELS: Record<CategoriaVehiculo, string> = {
    Todas: t("catalogo.categorias.todas"),
    SUVs: t("catalogo.categorias.suv"),
    Económicos: t("catalogo.categorias.economico"),
    Sedán: t("catalogo.categorias.sedan"),
    Premium: t("catalogo.categorias.premium"),
    Van: t("catalogo.categorias.van"),
  };

  // ── Header completo como componente del FlatList ──────────────────────────
  const ListHeader = () => (
    <View style={{ backgroundColor: c.bgHeader }}>
      {/* Logo */}
      <View style={[styles.header, { backgroundColor: c.bgHeader }]}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Búsqueda */}
      <View style={[styles.searchWrap, { backgroundColor: c.bgHeader }]}>
        <View style={[styles.searchBar, { backgroundColor: c.bgInput, borderColor: c.border }]}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: c.textPrimary }]}
            placeholder={t("catalogo.buscar")}
            placeholderTextColor={c.textMuted}
            value={filtros.busqueda}
            onChangeText={(v) => actualizarFiltro("busqueda", v)}
            autoCapitalize="none"
          />
          {filtros.busqueda.length > 0 && (
            <TouchableOpacity onPress={() => actualizarFiltro("busqueda", "")}>
              <Text style={[styles.searchClear, { color: c.textMuted }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categorías */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catsContent}
        style={[styles.catsRow, { backgroundColor: c.bgHeader }]}
      >
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, { backgroundColor: c.bgInput, borderColor: c.border }, filtros.categoria === cat && styles.catChipActive]}
            onPress={() => actualizarFiltro("categoria", cat)}
          >
            <Text style={[styles.catChipText, { color: c.textSecondary }, filtros.categoria === cat && styles.catChipTextActive]}>
              {CATEGORIA_LABELS[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contador */}
      <View style={[styles.contadorWrap, { backgroundColor: c.bgHeader, borderBottomColor: c.border }]}>
        <Text style={[styles.contadorText, { color: c.textSecondary }]}>
          {vehiculos.length} de {totalVehiculos} {t("catalogo.contador")}
        </Text>
      </View>
    </View>
  );

  // ── Empty state ───────────────────────────────────────────────────────────
  const ListEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={[styles.emptyTitle, { color: c.textPrimary }]}>{t("catalogo.sinResultados")}</Text>
      <Text style={[styles.emptySub, { color: c.textSecondary }]}>{t("catalogo.sinResultadosSubLargo")}</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={resetFiltros}>
        <Text style={styles.emptyBtnText}>{t("catalogo.limpiarFiltros")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: c.bg }]}>
      <StatusBar barStyle={c.oscuro ? "light-content" : "dark-content"} backgroundColor={c.bgHeader} />

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