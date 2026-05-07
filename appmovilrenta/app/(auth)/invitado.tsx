import { BannerRegistro } from "@/modules/invitado/components/BannerRegistro";
import { useInvitado } from "@/modules/invitado/hooks/useInvitado";
import { VehiculoInvitado } from "@/modules/invitado/types/invitado.types";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { invitadoStyles as styles } from "./_invitado.styles";

const P = "#1D4ED8";
const CATEGORIAS = ["Todos", "SUV", "Económico", "Sedán", "Premium", "Van"];

function Pill({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillEmoji}>{emoji}</Text>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

function VehiculoCard({
  v,
  onPress,
}: {
  v: VehiculoInvitado;
  onPress: () => void;
}) {
  const cfg = {
    disponible: { color: "#16A34A", bg: "#DCFCE7", label: "Disponible" },
    reservado: { color: "#DC2626", bg: "#FEE2E2", label: "Reservado" },
    mantenimiento: { color: "#D97706", bg: "#FEF3C7", label: "Mantenimiento" },
  }[v.estado];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardImg}>
        <Image source={v.imagen} style={styles.cardImg} resizeMode="cover" />
        <View style={[styles.estadoBadge, { backgroundColor: cfg.bg }]}>
          <View style={[styles.estadoDot, { backgroundColor: cfg.color }]} />
          <Text style={[styles.estadoText, { color: cfg.color }]}>
            {cfg.label}
          </Text>
        </View>
        <View style={styles.invitadoBadge}>
          <Text style={styles.invitadoBadgeText}>👁️ Solo vista</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={styles.catBadge}>
            <Text style={styles.catText}>{v.categoria}</Text>
          </View>
          <Text style={styles.anioText}>{v.anio}</Text>
        </View>
        <Text style={styles.cardNombre}>
          {v.marca} {v.modelo}
        </Text>
        <View style={styles.specRow}>
          <Pill emoji="👥" label={v.capacidad + " pas."} />
          <Pill
            emoji="⚙️"
            label={v.transmision === "automatica" ? "Auto" : "Manual"}
          />
          <Pill
            emoji="⛽"
            label={
              v.combustible.charAt(0).toUpperCase() + v.combustible.slice(1)
            }
          />
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.precio}>
              ${v.precioDia.toLocaleString("es-CO")}
            </Text>
            <Text style={styles.precioDia}>COP / día</Text>
          </View>
          <View style={styles.ratingRow}>
            <Text style={{ color: "#F59E0B", fontSize: 15 }}>★</Text>
            <Text style={styles.ratingVal}>{v.calificacion.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({v.totalCalificaciones})</Text>
          </View>
        </View>
        <View style={styles.cardSucursal}>
          <Text style={styles.sucursalText}>📍 {v.sucursal}</Text>
          <Text style={styles.kmText}>
            {v.kilometraje === "ilimitado" ? "∞ Km ilimitados" : "Km limitado"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function DetalleModal({
  v,
  onClose,
  onReservar,
}: {
  v: VehiculoInvitado;
  onClose: () => void;
  onReservar: () => void;
}) {
  const cfg = {
    disponible: { color: "#16A34A", bg: "#DCFCE7", label: "Disponible" },
    reservado: { color: "#DC2626", bg: "#FEE2E2", label: "No disponible" },
    mantenimiento: {
      color: "#D97706",
      bg: "#FEF3C7",
      label: "En mantenimiento",
    },
  }[v.estado];

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailHero}>
              <Image
                source={v.imagen}
                style={styles.detailEmoji}
                resizeMode="cover"
              />
              <View style={[styles.detailEstado, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.detailEstadoText, { color: cfg.color }]}>
                  {cfg.label}
                </Text>
              </View>
            </View>
            <View style={styles.detailHeader}>
              <View style={styles.catBadge}>
                <Text style={styles.catText}>{v.categoria}</Text>
              </View>
              <Text style={styles.detailNombre}>
                {v.marca} {v.modelo}
              </Text>
              <Text style={styles.detailAnio}>Modelo {v.anio}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Text
                    key={n}
                    style={{
                      fontSize: 18,
                      color:
                        n <= Math.round(v.calificacion) ? "#F59E0B" : "#E5E7EB",
                    }}
                  >
                    ★
                  </Text>
                ))}
                <Text
                  style={[styles.ratingVal, { marginLeft: 4, fontSize: 15 }]}
                >
                  {v.calificacion.toFixed(1)}
                </Text>
                <Text style={styles.ratingCount}>
                  ({v.totalCalificaciones} reseñas)
                </Text>
              </View>
            </View>
            <View style={styles.priceCard}>
              <View>
                <Text style={styles.priceLbl}>Tarifa por día</Text>
                <Text style={styles.priceVal}>
                  ${v.precioDia.toLocaleString("es-CO")}
                </Text>
                <Text style={styles.priceSub}>
                  COP ·{" "}
                  {v.kilometraje === "ilimitado"
                    ? "Km ilimitados"
                    : "Km limitado"}
                </Text>
              </View>
              <Text style={{ fontSize: 48 }}>{v.emoji}</Text>
            </View>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <View style={styles.descCard}>
              <Text style={styles.descText}>{v.descripcion}</Text>
            </View>
            <Text style={styles.sectionTitle}>Especificaciones</Text>
            <View style={styles.specsGrid}>
              {[
                {
                  icon: "⚙️",
                  lbl: "Transmisión",
                  val: v.transmision === "automatica" ? "Automática" : "Manual",
                },
                {
                  icon: "⛽",
                  lbl: "Combustible",
                  val:
                    v.combustible.charAt(0).toUpperCase() +
                    v.combustible.slice(1),
                },
                {
                  icon: "👥",
                  lbl: "Capacidad",
                  val: v.capacidad + " pasajeros",
                },
                { icon: "📍", lbl: "Sucursal", val: v.sucursal },
              ].map((s) => (
                <View key={s.lbl} style={styles.specCard}>
                  <Text style={styles.specIcon}>{s.icon}</Text>
                  <Text style={styles.specLbl}>{s.lbl}</Text>
                  <Text style={styles.specVal}>{s.val}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Servicios incluidos</Text>
            <View style={styles.serviciosCard}>
              {v.serviciosIncluidos.map((servicio) => (
                <View key={servicio} style={styles.servicioRow}>
                  <Text style={styles.servicioCheck}>✓</Text>
                  <Text style={styles.servicioText}>{servicio}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Disponibilidad</Text>
            <View style={styles.calendarioCard}>
              <View style={styles.calendarioHeader}>
                <Text style={styles.calendarioMes}>Mayo 2026</Text>
                <View style={styles.calendarioBadge}>
                  <Text style={styles.calendarioBadgeText}>Solo consulta</Text>
                </View>
              </View>
              <View style={styles.diasRow}>
                {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                  <Text key={d} style={styles.diaLabel}>
                    {d}
                  </Text>
                ))}
              </View>
              <View style={styles.diasGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => {
                  const reservado = [3, 4, 5, 12, 13, 20, 21].includes(dia);
                  const hoy = dia === 6;
                  return (
                    <View
                      key={dia}
                      style={[
                        styles.diaCell,
                        reservado && styles.diaCellReservado,
                        hoy && styles.diaCellHoy,
                      ]}
                    >
                      <Text
                        style={[
                          styles.diaCellText,
                          reservado && styles.diaCellTextReservado,
                          hoy && styles.diaCellTextHoy,
                        ]}
                      >
                        {dia}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.calendarioLeyenda}>
                <View style={styles.leyendaItem}>
                  <View
                    style={[styles.leyendaDot, { backgroundColor: "#DCFCE7" }]}
                  />
                  <Text style={styles.leyendaText}>Disponible</Text>
                </View>
                <View style={styles.leyendaItem}>
                  <View
                    style={[styles.leyendaDot, { backgroundColor: "#FEE2E2" }]}
                  />
                  <Text style={styles.leyendaText}>Reservado</Text>
                </View>
                <View style={styles.leyendaItem}>
                  <View style={[styles.leyendaDot, { backgroundColor: P }]} />
                  <Text style={styles.leyendaText}>Hoy</Text>
                </View>
              </View>
            </View>
            <View style={styles.incentivoCard}>
              <Text style={styles.incentivoEmoji}></Text>
              <View style={styles.incentivoTextos}>
                <Text style={styles.incentivoTitulo}>
                  ¿Te gusta este vehículo?
                </Text>
                <Text style={styles.incentivoDesc}>
                  Regístrate gratis para reservarlo ahora mismo.
                </Text>
              </View>
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reservarBtn}
              onPress={onReservar}
              activeOpacity={0.85}
            >
              <Text style={styles.reservarBtnText}>📅 Reservar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function InvitadoScreen() {
  const insets = useSafeAreaInsets();
  const {
    vehiculos,
    totalVehiculos,
    filtros,
    actualizarFiltro,
    resetFiltros,
    mostrarBannerReserva,
    intentarReservar,
    irARegistro,
    irALogin,
    cerrarBanner,
  } = useInvitado();

  const [detalle, setDetalle] = useState<VehiculoInvitado | null>(null);

  const hayFiltros =
    filtros.categoria !== "Todos" ||
    filtros.soloDisponibles ||
    filtros.busqueda.trim() !== "";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerMarca}> RentaMovil</Text>
          <Text style={styles.headerTitulo}>Explorar vehículos</Text>
          <Text style={styles.headerSub}>
            {vehiculos.length} de {totalVehiculos} vehículos
          </Text>
        </View>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.loginBtnText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.bannerIncentivo} onPress={irARegistro}>
        <Text style={styles.bannerIncentivoText}>
          🎁 Regístrate gratis y reserva tu vehículo ideal →
        </Text>
      </TouchableOpacity>

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar marca o modelo..."
            placeholderTextColor="#9CA3AF"
            value={filtros.busqueda}
            onChangeText={(t) => actualizarFiltro("busqueda", t)}
            autoCapitalize="none"
          />
          {filtros.busqueda.length > 0 && (
            <TouchableOpacity onPress={() => actualizarFiltro("busqueda", "")}>
              <Text
                style={{ fontSize: 14, color: "#9CA3AF", paddingHorizontal: 4 }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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
            onPress={() => actualizarFiltro("categoria", cat as any)}
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

      <View style={styles.quickFilters}>
        <TouchableOpacity
          style={[
            styles.qfChip,
            filtros.soloDisponibles && styles.qfChipActive,
          ]}
          onPress={() =>
            actualizarFiltro("soloDisponibles", !filtros.soloDisponibles)
          }
        >
          <Text
            style={[
              styles.qfText,
              filtros.soloDisponibles && styles.qfTextActive,
            ]}
          >
            ✓ Solo disponibles
          </Text>
        </TouchableOpacity>
        {hayFiltros && (
          <TouchableOpacity style={styles.resetChip} onPress={resetFiltros}>
            <Text style={styles.resetText}>✕ Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {vehiculos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 56, marginBottom: 16 }}>🔍</Text>
          <Text style={styles.emptyTitle}>Sin resultados</Text>
          <Text style={styles.emptySub}>
            No hay vehículos con esos filtros.
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
            <VehiculoCard v={item} onPress={() => setDetalle(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {detalle && (
        <DetalleModal
          v={detalle}
          onClose={() => setDetalle(null)}
          onReservar={() => {
            setDetalle(null);
            intentarReservar();
          }}
        />
      )}

      <BannerRegistro
        visible={mostrarBannerReserva}
        onRegistro={irARegistro}
        onLogin={irALogin}
        onCerrar={cerrarBanner}
      />
    </View>
  );
}
