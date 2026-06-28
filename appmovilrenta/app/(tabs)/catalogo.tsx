// app/(tabs)/catalogo.tsx

import BuscadorCatalogo from "@/modules/catalogo/components/BuscadorCatalogo";
import FiltrosCatalogo from "@/modules/catalogo/components/FiltrosCatalogo";
import VehiculoCard from "@/modules/catalogo/components/VehiculoCard";
import { COLORES } from "@/modules/catalogo/constants/catalogo.constants";
import { useCatalogo } from "@/modules/catalogo/hooks/useCatalogo";
import { useFavoritos } from "@/modules/catalogo/hooks/useFavoritos"; // ---
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ORDEN_OPCIONES = [
  { valor: "precio_asc", label: "Precio: menor a mayor" },
  { valor: "precio_desc", label: "Precio: mayor a menor" },
  { valor: "calificacion", label: "Mejor calificacion" },
];

const ALERT_CONTENT = {
  busqueda: {
    icono: "calendar-outline",
    color: "#1E40AF",
    bgColor: "#EFF6FF",
    titulo: "Elegi fechas y lugar",
    mensaje:
      "Inicia sesion para buscar por fecha de recogida, devolucion y sucursal.",
  },
  reservar: {
    icono: "car-sport-outline",
    color: "#1E40AF",
    bgColor: "#EFF6FF",
    titulo: "Reserva este vehiculo",
    mensaje: "Necesitas una cuenta activa para realizar reservas en Drivique.",
  },
  favorito: {
    icono: "heart-outline",
    color: "#1E40AF",
    bgColor: "#EFF6FF",
    titulo: "Guarda en favoritos",
    mensaje: "Inicia sesion para guardar tus vehiculos favoritos.",
  },
};

type AlertTipo = keyof typeof ALERT_CONTENT;

function ListFooter({
  paginaActual,
  totalPaginas,
  onAnterior,
  onSiguiente,
}: {
  paginaActual: number;
  totalPaginas: number;
  onAnterior: () => void;
  onSiguiente: () => void;
}) {
  if (totalPaginas <= 1) return null;
  return (
    <View style={styles.paginacionContainer}>
      <TouchableOpacity
        style={[
          styles.paginaBtn,
          paginaActual === 1 && styles.paginaBtnDisabled,
        ]}
        onPress={onAnterior}
        disabled={paginaActual === 1}
        activeOpacity={0.7}
      >
        <Ionicons
          name="arrow-back"
          size={16}
          color={paginaActual === 1 ? "#CBD5E1" : "#1E40AF"}
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

      <Text style={styles.paginaInfoTexto}>
        {paginaActual} / {totalPaginas}
      </Text>

      <TouchableOpacity
        style={[
          styles.paginaBtn,
          paginaActual === totalPaginas && styles.paginaBtnDisabled,
        ]}
        onPress={onSiguiente}
        disabled={paginaActual === totalPaginas}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.paginaBtnText,
            paginaActual === totalPaginas && styles.paginaBtnTextDisabled,
          ]}
        >
          Siguiente
        </Text>
        <Ionicons
          name="arrow-forward"
          size={16}
          color={paginaActual === totalPaginas ? "#CBD5E1" : "#1E40AF"}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function Catalogo() {
  const insets = useSafeAreaInsets();
  const usuario = useAuthStore((state) => state.usuario);
  const [textBusqueda, setTextBusqueda] = useState("");
  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [sweetAlertVisible, setSweetAlertVisible] = useState(false);
  const [alertTipo, setAlertTipo] = useState("busqueda" as AlertTipo);

  // --- FAVORITOS ---
  const usuarioId = usuario ? String(usuario.id ?? usuario.correo ?? "user") : null;
  const { favoritos, toggleFavorito, esFavorito } = useFavoritos(usuarioId);
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const {
    cargando,
    error,
    filtros,
    setFiltro,
    vehiculosPaginados,
    vehiculosFiltrados,
    limpiar,
    busquedaForm,
    setForm,
    handleBuscar,
    errorBusqueda,
    paginaActual,
    totalPaginas,
    paginaSiguiente,
    paginaAnterior,
  } = useCatalogo();

  const { sucursal } = useLocalSearchParams<{ sucursal?: string }>();

  useEffect(() => {
    if (sucursal) setFiltro("sucursal", sucursal);
  }, [sucursal]);

  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [ordenVisible, setOrdenVisible] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [paginaActual]);

  const ordenLabel =
    ORDEN_OPCIONES.find((o) => o.valor === filtros.orden)?.label ??
    "Ordenar por";

  const filtrosActivos =
    filtros.sucursal !== "Todas las sucursales" ||
    !!filtros.precioMin ||
    !!filtros.precioMax ||
    soloFavoritos; // --- incluir favoritos en el indicador activo

  // --- Filtrar por búsqueda de texto Y por soloFavoritos ---
  const vehiculosAMostrar = vehiculosPaginados.filter((vehiculo: any) => {
    const busqueda = textBusqueda.toLowerCase();
    const coincideTexto =
      (vehiculo.nombre || "").toLowerCase().includes(busqueda) ||
      (vehiculo.marca || "").toLowerCase().includes(busqueda) ||
      (vehiculo.modelo || "").toLowerCase().includes(busqueda);
    const coincideFavorito = soloFavoritos
      ? esFavorito(vehiculo.id)
      : true;
    return coincideTexto && coincideFavorito;
  });

  const abrirSweetAlert = (tipo: AlertTipo) => {
    setAlertTipo(tipo);
    setSweetAlertVisible(true);
  };

  // --- Toggle soloFavoritos: si se activa, desactiva al volver a presionar ---
  const handleToggleSoloFavoritos = () => {
    setSoloFavoritos((prev) => !prev);
  };

  const alertInfo = ALERT_CONTENT[alertTipo];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={true}
      />

      {/* HEADER */}
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

      {/* BUSCADOR */}
      <BuscadorCatalogo
        form={busquedaForm}
        setForm={setForm}
        textBusqueda={textBusqueda}
        setTextBusqueda={setTextBusqueda}
        onBuscar={handleBuscar}
        errorBusqueda={errorBusqueda}
        disabled={!usuario}
        onPressRestringida={() => abrirSweetAlert("busqueda")}
        modalFormVisible={modalFormVisible}
        setModalFormVisible={setModalFormVisible}
      />

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
            {vehiculosAMostrar.length} vehiculos
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
          ref={flatListRef}
          data={vehiculosAMostrar}
          keyExtractor={(item) => item.id.toString()}
          extraData={[paginaActual, favoritos, soloFavoritos]}
          renderItem={({ item }) => (
            <VehiculoCard
              vehiculo={item as any}
              invitado={!usuario}
              esFavorito={esFavorito(item.id)}
              onAccionRestringida={!usuario ? abrirSweetAlert : undefined}
              onToggleFavorito={usuario ? toggleFavorito : undefined}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            soloFavoritos ? (
              <View style={styles.estadoCentro}>
                <Ionicons name="heart-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>
                  Aún no tienes favoritos guardados
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={() => (
            <ListFooter
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onAnterior={paginaAnterior}
              onSiguiente={paginaSiguiente}
            />
          )}
        />
      )}

      {/* MODAL FILTROS */}
      <FiltrosCatalogo
        visible={filtrosVisible}
        onClose={() => setFiltrosVisible(false)}
        filtros={filtros}
        setFiltro={setFiltro}
        limpiar={() => {
          limpiar();
          setSoloFavoritos(false); // --- limpiar también el filtro de favoritos
        }}
        usuario={!!usuario}
        soloFavoritos={soloFavoritos}
        onToggleSoloFavoritos={handleToggleSoloFavoritos}
        totalFavoritos={favoritos.length}
      />

      {/* SWEET ALERT */}
      <Modal
        visible={sweetAlertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSweetAlertVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View
              style={[
                styles.alertIconContainer,
                { backgroundColor: alertInfo.bgColor },
              ]}
            >
              <Ionicons
                name={alertInfo.icono as any}
                size={44}
                color={alertInfo.color}
              />
            </View>

            <Text style={styles.alertTitle}>{alertInfo.titulo}</Text>
            <Text style={styles.alertMessage}>{alertInfo.mensaje}</Text>

            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity
                style={styles.alertCancelBtn}
                onPress={() => setSweetAlertVisible(false)}
              >
                <Text style={styles.alertCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.alertConfirmBtn,
                  { backgroundColor: alertInfo.color },
                ]}
                onPress={() => {
                  setSweetAlertVisible(false);
                  router.push("/(auth)/login");
                }}
              >
                <Text style={styles.alertConfirmBtnText}>Iniciar sesion</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
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
  loginBtnText: { fontSize: 13, fontWeight: "700", color: "#1E40AF" },
  registerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#1E40AF",
  },
  registerBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
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
  filtrosBtnActivo: { backgroundColor: "#1E40AF" },
  filtrosBtnText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  filtrosBtnTextActivo: { color: "#fff" },
  controlsRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  contadorText: { fontSize: 13, color: "#64748B", fontWeight: "600" },
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
  ordenOpcion: { paddingHorizontal: 16, paddingVertical: 12 },
  ordenOpcionActiva: { backgroundColor: "#F1F5F9" },
  ordenOpcionText: { fontSize: 13, color: "#1F2937" },
  ordenOpcionTextActiva: { color: "#1E40AF", fontWeight: "700" },
  lista: { padding: 16 },
  estadoCentro: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 },
  errorTexto: { fontSize: 14, color: "#EF4444", textAlign: "center" },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 12,
    fontWeight: "600",
  },
  paginacionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 28,
    paddingHorizontal: 4,
    gap: 8,
  },
  paginaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#1E40AF",
  },
  paginaBtnDisabled: { backgroundColor: "#F1F5F9" },
  paginaBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  paginaBtnTextDisabled: { color: "#CBD5E1" },
  paginaInfoTexto: { fontSize: 14, fontWeight: "700", color: "#475569" },
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
  alertButtonsContainer: { flexDirection: "row", width: "100%", gap: 12 },
  alertCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#1E40AF",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  alertCancelBtnText: { fontSize: 14, fontWeight: "600", color: "#1E40AF" },
  alertConfirmBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  alertConfirmBtnText: { fontSize: 14, fontWeight: "600", color: "#FFF" },
});