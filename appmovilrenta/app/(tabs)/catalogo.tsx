import { AlertModal } from "@/components/ui/AlertModal";
import BuscadorCatalogo from "@/modules/catalogo/components/BuscadorCatalogo";
import FiltrosCatalogo from "@/modules/catalogo/components/FiltrosCatalogo";
import VehiculoCard from "@/modules/catalogo/components/VehiculoCard";
import { useCatalogo } from "@/modules/catalogo/hooks/useCatalogo";
import { useFavoritos } from "@/modules/catalogo/hooks/useFavoritos";
import { useAuthStore } from "@/store/authStore";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
    icono: "calendar-outline" as const,
    titulo: "Elegi fechas y lugar",
    mensaje:
      "Inicia sesion para buscar por fecha de recogida, devolucion y sucursal.",
  },
  reservar: {
    icono: "car-sport-outline" as const,
    titulo: "Reserva este vehiculo",
    mensaje: "Necesitas una cuenta activa para realizar reservas en Drivique.",
  },
  favorito: {
    icono: "heart-outline" as const,
    titulo: "Guarda en favoritos",
    mensaje: "Inicia sesion para guardar tus vehiculos favoritos.",
  },
  sinResultados: {
    icono: "car-outline" as const,
    titulo: "Sin disponibilidad",
    mensaje:
      "No encontramos vehículos disponibles para esa ciudad, sucursal o esas fechas. Te mostramos el catálogo completo mientras tanto.",
  },
};

type AlertTipo = keyof typeof ALERT_CONTENT;

function nombreDesdeCorreo(correo?: string): string {
  if (!correo) return "Usuario";
  const parteLocal = correo.split("@")[0] ?? "";
  const limpio = parteLocal.replace(/[._-]+/g, " ").trim();
  if (!limpio) return "Usuario";
  return limpio
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function ListFooter({
  paginaActual,
  totalPaginas,
  onAnterior,
  onSiguiente,
  c,
}: {
  paginaActual: number;
  totalPaginas: number;
  onAnterior: () => void;
  onSiguiente: () => void;
  c: ReturnType<typeof useTemaColores>;
}) {
  if (totalPaginas <= 1) return null;
  return (
    <View style={styles.paginacionContainer}>
      <TouchableOpacity
        style={[
          styles.paginaBtn,
          paginaActual === 1 && [styles.paginaBtnDisabled, { backgroundColor: c.bgInput }],
        ]}
        onPress={onAnterior}
        disabled={paginaActual === 1}
        activeOpacity={0.7}
      >
        <Ionicons
          name="arrow-back"
          size={16}
          color={paginaActual === 1 ? c.textMuted : "#1E40AF"}
        />
        <Text
          style={[
            styles.paginaBtnText,
            paginaActual === 1 && [styles.paginaBtnTextDisabled, { color: c.textMuted }],
          ]}
        >
          Anterior
        </Text>
      </TouchableOpacity>

      <Text style={[styles.paginaInfoTexto, { color: c.textSecondary }]}>
        {paginaActual} / {totalPaginas}
      </Text>

      <TouchableOpacity
        style={[
          styles.paginaBtn,
          paginaActual === totalPaginas && [styles.paginaBtnDisabled, { backgroundColor: c.bgInput }],
        ]}
        onPress={onSiguiente}
        disabled={paginaActual === totalPaginas}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.paginaBtnText,
            paginaActual === totalPaginas && [styles.paginaBtnTextDisabled, { color: c.textMuted }],
          ]}
        >
          Siguiente
        </Text>
        <Ionicons
          name="arrow-forward"
          size={16}
          color={paginaActual === totalPaginas ? c.textMuted : "#1E40AF"}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function Catalogo() {
  const insets = useSafeAreaInsets();
  const c = useTemaColores();
  const usuario = useAuthStore((state) => state.usuario);
  const [textBusqueda, setTextBusqueda] = useState("");
  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [sweetAlertVisible, setSweetAlertVisible] = useState(false);
  const [alertTipo, setAlertTipo] = useState("busqueda" as AlertTipo);

  const usuarioId = usuario ? String(usuario.id ?? usuario.correo ?? "user") : null;
  const { favoritos, toggleFavorito, esFavorito } = useFavoritos(usuarioId);
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const {
    cargando,
    error,
    filtros,
    setFiltro,
    vehiculosPaginados,
    limpiarFiltros,
    limpiarBusqueda,
    busquedaForm,
    busquedaRealizada,
    setForm,
    handleBuscar,
    errorBusqueda,
    sinResultadosBusqueda,
    cerrarAlertaSinResultados,
    paginaActual,
    totalPaginas,
    paginaSiguiente,
    paginaAnterior,
  } = useCatalogo();

  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [ordenVisible, setOrdenVisible] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [paginaActual]);

  // Cuando la búsqueda de disponibilidad no encuentra vehículos, se muestra
  // la misma alerta estándar de la app (sin dejar el catálogo vacío).
  useEffect(() => {
    if (sinResultadosBusqueda) {
      setAlertTipo("sinResultados");
      setSweetAlertVisible(true);
      cerrarAlertaSinResultados();
    }
  }, [sinResultadosBusqueda, cerrarAlertaSinResultados]);

  const ordenLabel =
    ORDEN_OPCIONES.find((o) => o.valor === filtros.orden)?.label ??
    "Ordenar por";

  const filtrosActivos =
    filtros.sucursal !== "Todas las sucursales" ||
    !!filtros.precioMin ||
    !!filtros.precioMax ||
    soloFavoritos;

  const vehiculosAMostrar = vehiculosPaginados.filter((vehiculo: any) => {
    const busqueda = textBusqueda.toLowerCase();
    const coincideTexto =
      (vehiculo.nombre || "").toLowerCase().includes(busqueda) ||
      (vehiculo.marca || "").toLowerCase().includes(busqueda) ||
      (vehiculo.modelo || "").toLowerCase().includes(busqueda);
    const coincideFavorito = soloFavoritos ? esFavorito(vehiculo.id) : true;
    return coincideTexto && coincideFavorito;
  });

  // Si el usuario completó una búsqueda válida en "Consultar disponibilidad",
  // esos datos precargan (editables) el resumen de la reserva. lugarDevolucion
  // de BusquedaForm en realidad guarda la sucursal (así lo maneja BuscadorCatalogo
  // y useCatalogo), por eso mapea a lugarRetiro en la reserva.
  const datosPrecargaReserva = busquedaRealizada
    ? {
        lugarRetiro: busquedaForm.lugarDevolucion,
        fechaRetiro: busquedaForm.fechaInicio,
        fechaDevolucion: busquedaForm.fechaFin,
      }
    : undefined;

  const abrirSweetAlert = (tipo: AlertTipo) => {
    setAlertTipo(tipo);
    setSweetAlertVisible(true);
  };

  const handleToggleSoloFavoritos = () => {
    setSoloFavoritos((prev) => !prev);
  };

  // Al tocar el bloque "Bienvenido, ..." + avatar, lleva al tab Perfil
  // (mismo destino que la pestaña "Perfil" de la barra de navegación).
  const irAPerfil = () => {
    router.push("/(tabs)/perfil");
  };

  const alertInfo = ALERT_CONTENT[alertTipo];

  // La alerta de "sin resultados" es informativa: solo botón "Entendido".
  // El resto de alertas mantiene los botones Cancelar / Iniciar sesion.
  const alertBotones =
    alertTipo === "sinResultados"
      ? [
          {
            texto: "Entendido",
            variante: "primario" as const,
            onPress: () => setSweetAlertVisible(false),
          },
        ]
      : [
          {
            texto: "Cancelar",
            variante: "secundario" as const,
            onPress: () => setSweetAlertVisible(false),
          },
          {
            texto: "Iniciar sesion",
            variante: "primario" as const,
            onPress: () => {
              setSweetAlertVisible(false);
              router.push("/(auth)/login");
            },
          },
        ];

  const nombreUsuario = usuario
    ? (usuario.nombres?.trim() || nombreDesdeCorreo(usuario.correo))
    : "";
  const inicialUsuario = nombreUsuario.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: c.bg }]}>
      <StatusBar
        barStyle={c.oscuro ? "light-content" : "dark-content"}
        backgroundColor={c.bgHeader}
        translucent={true}
      />

      <View style={[styles.header, { backgroundColor: c.bgHeader, borderBottomColor: c.border }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Drivique</Text>
        </View>
        {usuario ? (
          <TouchableOpacity
            style={styles.headerUsuario}
            onPress={irAPerfil}
            activeOpacity={0.7}
          >
            <Text style={[styles.headerUsuarioTexto, { color: c.textSecondary }]} numberOfLines={1}>
              Bienvenido, {nombreUsuario}
            </Text>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarTexto}>{inicialUsuario}</Text>
            </View>
          </TouchableOpacity>
        ) : (
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

      <BuscadorCatalogo
        form={busquedaForm}
        setForm={setForm}
        textBusqueda={textBusqueda}
        setTextBusqueda={setTextBusqueda}
        onBuscar={handleBuscar}
        onLimpiarBusqueda={limpiarBusqueda}
        errorBusqueda={errorBusqueda}
        disabled={!usuario}
        onPressRestringida={() => abrirSweetAlert("busqueda")}
        modalFormVisible={modalFormVisible}
        setModalFormVisible={setModalFormVisible}
      />

      <View style={[styles.controlsBar, { backgroundColor: c.bgHeader, borderBottomColor: c.border }]}>
        <TouchableOpacity
          style={[styles.filtrosBtn, { backgroundColor: c.bgInput }, filtrosActivos && styles.filtrosBtnActivo]}
          onPress={() => setFiltrosVisible(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons
              name="options-outline"
              size={16}
              color={filtrosActivos ? "#fff" : c.textSecondary}
            />
            <Text
              style={[
                styles.filtrosBtnText,
                { color: c.textSecondary },
                filtrosActivos && styles.filtrosBtnTextActivo,
              ]}
            >
              Filtros
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.controlsRight}>
          <Text style={[styles.contadorText, { color: c.textSecondary }]}>
            {vehiculosAMostrar.length} vehiculos
          </Text>
          <TouchableOpacity
            style={[styles.ordenBtn, { backgroundColor: c.bgInput, borderColor: c.border }]}
            onPress={() => setOrdenVisible(!ordenVisible)}
          >
            <Text style={[styles.ordenBtnText, { color: c.textPrimary }]} numberOfLines={1}>
              {ordenLabel} ▼
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {ordenVisible && (
        <View style={[styles.ordenDropdown, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          {ORDEN_OPCIONES.map((op) => (
            <TouchableOpacity
              key={op.valor}
              style={[
                styles.ordenOpcion,
                filtros.orden === op.valor && { backgroundColor: c.primaryBg },
              ]}
              onPress={() => {
                setFiltro("orden", op.valor);
                setOrdenVisible(false);
              }}
            >
              <Text
                style={[
                  styles.ordenOpcionText,
                  { color: c.textPrimary },
                  filtros.orden === op.valor && styles.ordenOpcionTextActiva,
                ]}
              >
                {op.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
              datosPrecarga={datosPrecargaReserva}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            soloFavoritos ? (
              <View style={styles.estadoCentro}>
                <Ionicons name="heart-outline" size={48} color={c.textMuted} />
                <Text style={[styles.emptyText, { color: c.textMuted }]}>
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
              c={c}
            />
          )}
        />
      )}

      <FiltrosCatalogo
        visible={filtrosVisible}
        onClose={() => setFiltrosVisible(false)}
        filtros={filtros}
        setFiltro={setFiltro}
        limpiar={() => {
          limpiarFiltros();
          setSoloFavoritos(false);
        }}
        usuario={!!usuario}
        soloFavoritos={soloFavoritos}
        onToggleSoloFavoritos={handleToggleSoloFavoritos}
        totalFavoritos={favoritos.length}
      />

      <AlertModal
        visible={sweetAlertVisible}
        icono={alertInfo.icono}
        titulo={alertInfo.titulo}
        mensaje={alertInfo.mensaje}
        botones={alertBotones}
        onCerrar={() => setSweetAlertVisible(false)}
      />
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
  headerUsuario: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: 200,
  },
  headerUsuarioTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    flexShrink: 1,
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1E40AF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarTexto: { fontSize: 13, fontWeight: "800", color: "#fff" },
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
  emptyText: { fontSize: 14, color: "#94A3B8", marginTop: 12, fontWeight: "600" },
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
});