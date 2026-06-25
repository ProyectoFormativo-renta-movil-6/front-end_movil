// app/(tabs)/index.tsx

import BuscadorCatalogo from "@/modules/catalogo/components/BuscadorCatalogo";
import FiltrosCatalogo from "@/modules/catalogo/components/FiltrosCatalogo";
import VehiculoCard from "@/modules/catalogo/components/VehiculoCard";
import { COLORES } from "@/modules/catalogo/constants/catalogo.constants";
import { useCatalogo } from "@/modules/catalogo/hooks/useCatalogo";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ORDEN_OPCIONES = [
  { valor: "precio_asc", label: "Precio: menor a mayor" },
  { valor: "precio_desc", label: "Precio: mayor a menor" },
  { valor: "calificacion", label: "Mejor calificación" },
];

export default function InicioScreen() {
  const insets = useSafeAreaInsets();
  const usuario = useAuthStore((state) => state.usuario);
  const invitado = !usuario;

  const {
    cargando,
    error,
    filtros,
    setFiltro,
    vehiculosFiltrados,
    vehiculosPaginados,
    totalPaginas,
    paginaActual,
    paginaSiguiente,
    paginaAnterior,
    limpiar,
    busquedaForm,
    setForm,
    handleBuscarInvitado,
    errorBusqueda,
  } = useCatalogo();

  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [ordenVisible, setOrdenVisible] = useState(false);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaAccion, setAlertaAccion] = useState<"reservar" | "favorito">(
    "reservar",
  );

  const ordenLabel =
    ORDEN_OPCIONES.find((o) => o.valor === filtros.orden)?.label ??
    "Ordenar por";

  const filtrosActivos =
    filtros.categoria !== "Todos" ||
    filtros.transmision !== "Todas" ||
    filtros.combustible !== "Todos" ||
    filtros.sucursal !== "Todas las sucursales" ||
    !!filtros.precioMin ||
    !!filtros.precioMax;

  const handleAccionRestringida = (accion: "reservar" | "favorito") => {
    setAlertaAccion(accion);
    setAlertaVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {invitado ? (
          <View style={styles.headerBtns}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.loginBtnText}>Ingresar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push("/(auth)/registro")}
            >
              <Text style={styles.registerBtnText}>Registro</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerUsuario}>
            <Ionicons name="person-circle-outline" size={28} color="#2f4ea2" />
            <Text style={styles.headerUsuarioNombre} numberOfLines={1}>
              {usuario?.nombres ?? "Usuario"}
            </Text>
          </View>
        )}
      </View>

      {/* BUSCADOR — siempre visible, deshabilitado para invitados */}
      <View style={styles.buscadorWrap}>
        <BuscadorCatalogo
          form={busquedaForm}
          setForm={setForm}
          onBuscar={invitado ? handleBuscarInvitado : () => {}}
          errorBusqueda={errorBusqueda}
          disabled={invitado}
        />
      </View>

      {/* BÚSQUEDA POR NOMBRE */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar vehículo..."
            placeholderTextColor="#9CA3AF"
            value={filtros.busqueda}
            onChangeText={(val) => setFiltro("busqueda", val)}
          />
          {filtros.busqueda ? (
            <TouchableOpacity onPress={() => setFiltro("busqueda", "")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* BARRA DE CONTROLES */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          style={[styles.filtrosBtn, filtrosActivos && styles.filtrosBtnActivo]}
          onPress={() => setFiltrosVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={15}
            color={filtrosActivos ? "#fff" : COLORES.textSecondary}
          />
          <Text
            style={[
              styles.filtrosBtnText,
              filtrosActivos && styles.filtrosBtnTextActivo,
            ]}
          >
            Filtros{filtrosActivos ? " •" : ""}
          </Text>
        </TouchableOpacity>

        <View style={styles.controlsRight}>
          <Text style={styles.contadorText}>
            {vehiculosFiltrados.length} vehículo
            {vehiculosFiltrados.length !== 1 ? "s" : ""}
          </Text>
          <TouchableOpacity
            style={styles.ordenBtn}
            onPress={() => setOrdenVisible(!ordenVisible)}
          >
            <Text style={styles.ordenBtnText} numberOfLines={1}>
              {ordenLabel}
            </Text>
            <Ionicons
              name={ordenVisible ? "chevron-up" : "chevron-down"}
              size={13}
              color={COLORES.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* DROPDOWN ORDEN */}
      {ordenVisible && (
        <View style={styles.ordenDropdown}>
          {ORDEN_OPCIONES.map((op) => (
            <TouchableOpacity
              key={op.valor}
              style={[
                styles.ordenOpcion,
                filtros.orden === op.valor && styles.ordenOpcionActiva,
              ]}
              onPress={() => {
                setFiltro("orden", op.valor);
                setOrdenVisible(false);
              }}
            >
              {filtros.orden === op.valor && (
                <Ionicons name="checkmark" size={14} color="#2f4ea2" />
              )}
              <Text
                style={[
                  styles.ordenOpcionText,
                  filtros.orden === op.valor && styles.ordenOpcionTextActiva,
                ]}
              >
                {op.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* CONTENIDO */}
      {cargando ? (
        <View style={styles.estadoCentro}>
          <ActivityIndicator size="large" color="#2f4ea2" />
          <Text style={styles.estadoTexto}>Cargando vehículos...</Text>
        </View>
      ) : error ? (
        <View style={styles.estadoCentro}>
          <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
          <Text style={styles.errorTexto}>{error}</Text>
          <TouchableOpacity style={styles.accionBtn} onPress={limpiar}>
            <Text style={styles.accionBtnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : vehiculosFiltrados.length === 0 ? (
        <View style={styles.estadoCentro}>
          <Ionicons name="car-outline" size={56} color="#D1D5DB" />
          <Text style={styles.estadoTitulo}>Sin resultados</Text>
          <Text style={styles.estadoTexto}>
            Intenta cambiar o limpiar los filtros.
          </Text>
          <TouchableOpacity style={styles.accionBtn} onPress={limpiar}>
            <Text style={styles.accionBtnText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehiculosPaginados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VehiculoCard
              vehiculo={item}
              invitado={invitado}
              onAccionRestringida={handleAccionRestringida}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            totalPaginas > 1 ? (
              <View style={styles.paginacion}>
                <TouchableOpacity
                  style={[
                    styles.paginaBtn,
                    paginaActual === 1 && styles.paginaBtnDisabled,
                  ]}
                  onPress={paginaAnterior}
                  disabled={paginaActual === 1}
                >
                  <Ionicons
                    name="chevron-back"
                    size={16}
                    color={
                      paginaActual === 1
                        ? COLORES.paginationDisabledText
                        : "#fff"
                    }
                  />
                  <Text
                    style={[
                      styles.paginaBtnText,
                      paginaActual === 1 && styles.paginaBtnTextDisabled,
                    ]}
                  >
                    Anterior
                  </Text>
                </TouchableOpacity>
                <Text style={styles.paginaInfo}>
                  {paginaActual} / {totalPaginas}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.paginaBtn,
                    paginaActual === totalPaginas && styles.paginaBtnDisabled,
                  ]}
                  onPress={paginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                >
                  <Text
                    style={[
                      styles.paginaBtnText,
                      paginaActual === totalPaginas &&
                        styles.paginaBtnTextDisabled,
                    ]}
                  >
                    Siguiente
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={
                      paginaActual === totalPaginas
                        ? COLORES.paginationDisabledText
                        : "#fff"
                    }
                  />
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}

      {/* MODAL FILTROS */}
      <FiltrosCatalogo
        visible={filtrosVisible}
        onClose={() => setFiltrosVisible(false)}
        filtros={filtros}
        setFiltro={setFiltro}
        limpiar={limpiar}
      />

      {/* ALERTA PERSONALIZADA — bien contenida */}
      <Modal
        visible={alertaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAlertaVisible(false)}
      >
        <Pressable
          style={styles.alertOverlay}
          onPress={() => setAlertaVisible(false)}
        >
          <Pressable style={styles.alertCard} onPress={() => {}}>
            <View style={styles.alertIconWrap}>
              <Ionicons name="person-add-outline" size={28} color="#2f4ea2" />
            </View>
            <Text style={styles.alertTitle}>Registro requerido</Text>
            <Text style={styles.alertBody}>
              {alertaAccion === "reservar"
                ? "Para realizar una reserva necesitas una cuenta. Regístrate o inicia sesión."
                : "Para guardar favoritos necesitas una cuenta. Regístrate o inicia sesión."}
            </Text>
            <View style={styles.alertBtns}>
              <TouchableOpacity
                style={styles.alertBtnSecundario}
                onPress={() => setAlertaVisible(false)}
              >
                <Text style={styles.alertBtnSecundarioText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.alertBtnPrimario}
                onPress={() => {
                  setAlertaVisible(false);
                  router.push("/(auth)/registro");
                }}
              >
                <Text style={styles.alertBtnPrimarioText}>
                  Ir a registrarse
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.pageBg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  logo: {
    width: 110,
    height: 32,
  },
  headerBtns: {
    flexDirection: "row",
    gap: 6,
  },
  loginBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#2f4ea2",
  },
  loginBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2f4ea2",
  },
  registerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#2f4ea2",
  },
  registerBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  headerUsuario: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerUsuarioNombre: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2f4ea2",
    maxWidth: 120,
  },
  buscadorWrap: {
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORES.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORES.inputText,
    paddingVertical: Platform.OS === "android" ? 0 : 2,
  },
  controlsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
    gap: 8,
  },
  filtrosBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORES.chipBg,
    borderWidth: 1,
    borderColor: COLORES.panelBorder,
  },
  filtrosBtnActivo: {
    backgroundColor: "#2f4ea2",
    borderColor: "#2f4ea2",
  },
  filtrosBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORES.textSecondary,
  },
  filtrosBtnTextActivo: {
    color: "#fff",
  },
  controlsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  contadorText: {
    fontSize: 12,
    color: COLORES.textSecondary,
    fontWeight: "600",
  },
  ordenBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORES.inputBorder,
    backgroundColor: COLORES.inputBg,
    maxWidth: 150,
  },
  ordenBtnText: {
    fontSize: 11,
    color: COLORES.inputText,
    fontWeight: "600",
    flex: 1,
  },
  ordenDropdown: {
    position: "absolute",
    top: 210,
    right: 16,
    zIndex: 100,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORES.panelBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
    minWidth: 200,
  },
  ordenOpcion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  ordenOpcionActiva: {
    backgroundColor: "#EEF2FF",
  },
  ordenOpcionText: {
    fontSize: 13,
    color: COLORES.textPrimary,
  },
  ordenOpcionTextActiva: {
    color: "#2f4ea2",
    fontWeight: "700",
  },
  lista: {
    padding: 16,
    paddingBottom: 32,
  },
  estadoCentro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  estadoTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORES.textPrimary,
  },
  estadoTexto: {
    fontSize: 14,
    color: COLORES.textSecondary,
    textAlign: "center",
  },
  errorTexto: {
    fontSize: 15,
    color: COLORES.dangerText,
    fontWeight: "700",
    textAlign: "center",
  },
  accionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2f4ea2",
  },
  accionBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  paginacion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingBottom: 8,
  },
  paginaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#2f4ea2",
  },
  paginaBtnDisabled: {
    backgroundColor: COLORES.paginationDisabledBg,
  },
  paginaBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  paginaBtnTextDisabled: {
    color: COLORES.paginationDisabledText,
  },
  paginaInfo: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORES.textPrimary,
  },
  // Alerta personalizada
  alertOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  alertCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  alertIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  alertBody: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  alertBtns: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  alertBtnSecundario: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  alertBtnSecundarioText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
  alertBtnPrimario: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#2f4ea2",
    alignItems: "center",
  },
  alertBtnPrimarioText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});
