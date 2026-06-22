import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VehiculoCard } from "@/modules/catalogo/components/VehiculoCard";
import { useCatalogo } from "@/modules/catalogo/hooks/useCatalogo";
import { useFavoritos } from "@/modules/catalogo/hooks/useFavoritos";
import { catalogoStyles as styles } from "@/modules/catalogo/styles/catalogo.styles";
import { CATEGORIAS } from "@/modules/catalogo/types/catalogo.types";
import { useAuthStore } from "@/store/authStore";

export default function CatalogoScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Si no hay usuario en el store, estamos en modo invitado.
  const usuario = useAuthStore((state) => state.usuario);
  const invitado = !usuario;

  const {
    vehiculosFiltrados,
    vehiculosPaginados,
    filtros,
    paginaActual,
    totalPaginas,
    cargando,
    error,
    setFiltro,
    resetFiltros,
    paginaSiguiente,
    paginaAnterior,
  } = useCatalogo();

  const { esFavorito, toggleFavorito } = useFavoritos(usuario?.id ?? null);

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

      {/* Aviso de modo invitado */}
      {invitado && (
        <View style={localS.bannerInvitado}>
          <Text style={localS.bannerInvitadoTexto}>
            👋 Estás navegando como invitado. Inicia sesión para reservar y
            guardar favoritos.
          </Text>
        </View>
      )}

      {/* Búsqueda */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t("catalogo.buscar")}
            placeholderTextColor="#9CA3AF"
            value={filtros.busqueda}
            onChangeText={(val) => setFiltro("busqueda", val)}
          />
          {filtros.busqueda ? (
            <TouchableOpacity onPress={() => setFiltro("busqueda", "")}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Categorías */}
      <ScrollView
        horizontal
        style={styles.catsRow}
        contentContainerStyle={styles.catsContent}
        showsHorizontalScrollIndicator={false}
      >
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catChip,
              filtros.categoria === cat && styles.catChipActive,
            ]}
            onPress={() => setFiltro("categoria", cat)}
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

      {/* Contador */}
      <View style={styles.contadorWrap}>
        <Text style={styles.contadorText}>
          {vehiculosFiltrados.length} {t("catalogo.contador")}
        </Text>
      </View>

      {/* Estado de carga / error / lista */}
      {cargando ? (
        <View style={localS.centro}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      ) : error ? (
        <View style={localS.centro}>
          <Text style={localS.errorTexto}>⚠️ {error}</Text>
        </View>
      ) : (
        <FlatList
          data={vehiculosPaginados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <VehiculoCard
              vehiculo={item}
              invitado={invitado}
              esFavorito={esFavorito(item.id)}
              onToggleFavorito={toggleFavorito}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🚗</Text>
              <Text style={styles.emptyTitle}>
                {t("catalogo.sinResultados")}
              </Text>
              <Text style={styles.emptySub}>
                {t("catalogo.sinResultadosSubLargo")}
              </Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={resetFiltros}>
                <Text style={styles.emptyBtnText}>
                  {t("catalogo.limpiarFiltros")}
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            vehiculosFiltrados.length > 0 ? (
              <View style={localS.paginacion}>
                <TouchableOpacity
                  style={[
                    localS.paginaBtn,
                    paginaActual === 1 && localS.paginaBtnDeshabilitado,
                  ]}
                  onPress={paginaAnterior}
                  disabled={paginaActual === 1}
                >
                  <Text style={localS.paginaBtnTexto}>‹ Anterior</Text>
                </TouchableOpacity>

                <Text style={localS.paginaInfo}>
                  {paginaActual} / {totalPaginas}
                </Text>

                <TouchableOpacity
                  style={[
                    localS.paginaBtn,
                    paginaActual === totalPaginas &&
                      localS.paginaBtnDeshabilitado,
                  ]}
                  onPress={paginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                >
                  <Text style={localS.paginaBtnTexto}>Siguiente ›</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const localS = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorTexto: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  bannerInvitado: {
    backgroundColor: "#FEF3C7",
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerInvitadoTexto: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "500",
    textAlign: "center",
  },
  paginacion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 8,
  },
  paginaBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  paginaBtnDeshabilitado: {
    opacity: 0.4,
  },
  paginaBtnTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  paginaInfo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
});
