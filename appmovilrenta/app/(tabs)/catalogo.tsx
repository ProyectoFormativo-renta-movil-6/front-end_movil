// app/(tabs)/catalogo.tsx

import BuscadorCatalogo from "@/modules/catalogo/components/BuscadorCatalogo";
import FiltrosCatalogo from "@/modules/catalogo/components/FiltrosCatalogo";
import VehiculoCard from "@/modules/catalogo/components/VehiculoCard";
import { COLORES } from "@/modules/catalogo/constants/catalogo.constants";
import { useCatalogo } from "@/modules/catalogo/hooks/useCatalogo";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ORDEN_OPCIONES = [
  { valor: "precio_asc", label: "Precio: menor a mayor" },
  { valor: "precio_desc", label: "Precio: mayor a menor" },
  { valor: "calificacion", label: "Mejor calificación" },
];

export default function Catalogo() {
  const insets = useSafeAreaInsets(); // FIX: Soluciona el recorte en Android
  const usuario = useAuthStore((state) => state.usuario);
  const [textBusqueda, setTextBusqueda] = useState("");
  const [modalFormVisible, setModalFormVisible] = useState(false);

  // Estado para controlar el modal estilo SweetAlert
  const [sweetAlertVisible, setSweetAlertVisible] = useState(false);

  const {
    cargando,
    error,
    filtros,
    setFiltro,
    vehiculosPaginados,
    totalPaginas,
    paginaActual,
    paginaSiguiente,
    paginaAnterior,
    limpiar,
    busquedaForm,
    setForm,
    handleBuscar,
    errorBusqueda,
  } = useCatalogo();

  const { sucursal } = useLocalSearchParams<{ sucursal?: string }>();

  useEffect(() => {
    if (sucursal) setFiltro("sucursal", sucursal);
  }, [sucursal]);

  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [ordenVisible, setOrdenVisible] = useState(false);

  const ordenLabel =
    ORDEN_OPCIONES.find((o) => o.valor === filtros.orden)?.label ??
    "Ordenar por";

  const filtrosActivos =
    filtros.sucursal !== "Todas las sucursales" ||
    !!filtros.precioMin ||
    !!filtros.precioMax;

  // Filtrado en tiempo real
  const vehiculosAMostrar = vehiculosPaginados.filter((vehiculo: any) => {
    const nombreVehiculo = (vehiculo.nombre || "").toLowerCase();
    const marcaVehiculo = (vehiculo.marca || "").toLowerCase();
    const modeloVehiculo = (vehiculo.modelo || "").toLowerCase();
    const busqueda = textBusqueda.toLowerCase();

    return (
      nombreVehiculo.includes(busqueda) ||
      marcaVehiculo.includes(busqueda) ||
      modeloVehiculo.includes(busqueda)
    );
  });

  const abrirSweetAlert = () => {
    setSweetAlertVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={true}
      />

      {/* HEADER CORREGIDO */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Drivique</Text>
        </View>

        {!usuario && (
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
        )}
      </View>

      {/* RENDERIZADO DE BUSCADORES */}
      {!usuario ? (
        <View style={styles.seccionBuscadoresInvitado}>
          {/* 1. Barra Falsa que simula SweetAlert al pulsar */}
          <TouchableOpacity
            style={styles.barraBloqueada}
            activeOpacity={0.7}
            onPress={abrirSweetAlert}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.textBloqueado} numberOfLines={1}>
              Inicia sesión para elegir fechas y lugar de reserva
            </Text>
          </TouchableOpacity>

          {/* 2. Filtro de Texto Libre */}
          <View style={styles.barraInputInvitado}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.textInputInvitado}
              placeholder="Buscar vehículo por marca o modelo..."
              placeholderTextColor="#9CA3AF"
              value={textBusqueda}
              onChangeText={setTextBusqueda}
            />
          </View>
        </View>
      ) : (
        <BuscadorCatalogo
          form={busquedaForm}
          setForm={setForm}
          textBusqueda={textBusqueda}
          setTextBusqueda={setTextBusqueda}
          onBuscar={handleBuscar}
          errorBusqueda={errorBusqueda}
          disabled={false}
          modalFormVisible={modalFormVisible}
          setModalFormVisible={setModalFormVisible}
        />
      )}

      {/* BARRA DE CONTROLES */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          style={[styles.filtrosBtn, filtrosActivos && styles.filtrosBtnActivo]}
          onPress={() => setFiltrosVisible(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons
              name="options-outline"
              size={16}
              color={filtrosActivos ? "#fff" : COLORES.textSecondary}
            />
            <Text
              style={[
                styles.filtrosBtnText,
                filtrosActivos && styles.filtrosBtnTextActivo,
              ]}
            >
              Filtros
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.controlsRight}>
          <Text style={styles.contadorText}>
            {vehiculosAMostrar.length} vehículos
          </Text>
          <TouchableOpacity
            style={styles.ordenBtn}
            onPress={() => setOrdenVisible(!ordenVisible)}
          >
            <Text style={styles.ordenBtnText} numberOfLines={1}>
              {ordenLabel} ▼
            </Text>
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

      {/* LISTADO */}
      {cargando ? (
        <View style={styles.estadoCentro}>
          <ActivityIndicator size="large" color="#1E40AF" />
        </View>
      ) : error ? (
        <View style={styles.estadoCentro}>
          <Text style={styles.errorTexto}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={vehiculosAMostrar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VehiculoCard
              vehiculo={item}
              invitado={!usuario}
              esFavorito={false}
              {...({
                onReservar: abrirSweetAlert,
                onAccionRestringida: abrirSweetAlert,
              } as any)}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
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

      {/* MODAL ESTILO SWEET ALERT REQUERIDO */}
      <Modal
        visible={sweetAlertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSweetAlertVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconContainer}>
              <Ionicons
                name="information-circle-outline"
                size={44}
                color="#3B82F6"
              />
            </View>

            <Text style={styles.alertTitle}>Función Requerida</Text>
            <Text style={styles.alertMessage}>
              Para buscar disponibilidad por fechas, elegir lugar de retiro y
              gestionar tus reservas, necesitas una cuenta activa.
            </Text>

            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity
                style={styles.alertCancelBtn}
                onPress={() => setSweetAlertVisible(false)}
              >
                <Text style={styles.alertCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.alertConfirmBtn}
                onPress={() => {
                  setSweetAlertVisible(false);
                  router.push("/(auth)/registro");
                }}
              >
                <Text style={styles.alertConfirmBtnText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitleContainer: { flex: 1 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1E40AF",
    letterSpacing: -0.5,
  },
  headerBtns: { flexDirection: "row", gap: 8, alignItems: "center" },
  loginBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#1E40AF",
  },
  loginBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E40AF",
  },
  registerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#1E40AF",
  },
  registerBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  seccionBuscadoresInvitado: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  barraBloqueada: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textBloqueado: {
    flex: 1,
    fontSize: 13.5,
    color: "#6B7280",
    fontWeight: "500",
  },
  barraInputInvitado: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    height: 46,
    paddingHorizontal: 14,
  },
  textInputInvitado: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    height: "100%",
  },

  controlsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filtrosBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  filtrosBtnActivo: {
    backgroundColor: "#1E40AF",
  },
  filtrosBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  filtrosBtnTextActivo: { color: "#fff" },
  controlsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contadorText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  ordenBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFF",
  },
  ordenBtnText: { fontSize: 13, color: "#1E293B", fontWeight: "600" },
  ordenDropdown: {
    position: "absolute",
    top: 170,
    right: 16,
    zIndex: 100,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 4,
  },
  ordenOpcion: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ordenOpcionActiva: { backgroundColor: "#F1F5F9" },
  ordenOpcionText: { fontSize: 13, color: "#1F2937" },
  ordenOpcionTextActiva: { color: "#1E40AF", fontWeight: "700" },
  lista: { padding: 16 },
  estadoCentro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorTexto: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },

  // ESTILOS SWEET ALERT CUSTOM
  alertOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  alertBox: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  alertIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: 13.5,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  alertButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  alertCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  alertCancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  alertConfirmBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#1E40AF",
    justifyContent: "center",
    alignItems: "center",
  },
  alertConfirmBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
});
