import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { GRADIENTES } from "@/constants/gradients";
import { COLOR_MARCA } from "@/modules/catalogo/constants/catalogo.constants";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import {
  ReservaGuardada,
  reservaPersistService,
} from "@/modules/reserva/services/reservaPersistService";
import { fmt } from "@/modules/reserva/components/ResumenReservaModal.piezas";

const COLOR_ESTADO: Record<string, string> = {
  PENDIENTE: "#f59e0b",
  PENDIENTE_EFECTIVO: "#f59e0b",
  PENDIENTE_VALIDACION: "#2563eb",
  CONFIRMADA: "#16a34a",
  CANCELADA: "#dc2626",
  CANCELADA_POR_TIEMPO: "#dc2626",
};

export default function MisReservasScreen() {
  const insets = useSafeAreaInsets();
  const c = useTemaColores();
  const { t } = useTranslation();
  const [reservas, setReservas] = useState<ReservaGuardada[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      (async () => {
        const data = await reservaPersistService.getReservas();
        if (activo) {
          setReservas([...data].reverse());
          setCargando(false);
        }
      })();
      return () => {
        activo = false;
      };
    }, [])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: c.bg }]}>
      <View style={[styles.header, { backgroundColor: c.bgHeader, borderBottomColor: c.border }]}>
        <Text style={[styles.headerTitulo, { color: c.textPrimary }]}>{t("misReservas.titulo")}</Text>
        <Text style={[styles.headerSubtitulo, { color: c.textSecondary }]}>
          {t("misReservas.subtitulo")}
        </Text>
      </View>

      {!cargando && reservas.length > 0 ? (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.referencia}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.tarjeta, { backgroundColor: c.bgCard, borderColor: c.border }]}
              onPress={() => router.push(`/pago-respuesta?ref=${encodeURIComponent(item.referencia)}`)}
            >
              <View style={styles.tarjetaHeader}>
                <Text style={[styles.tarjetaVehiculo, { color: c.textPrimary }]} numberOfLines={1}>
                  {item.vehiculoNombre}
                </Text>
                <View style={[styles.badge, { backgroundColor: `${COLOR_ESTADO[item.estado] ?? "#6b7280"}22` }]}>
                  <View style={[styles.badgeDot, { backgroundColor: COLOR_ESTADO[item.estado] ?? "#6b7280" }]} />
                  <Text style={[styles.badgeTexto, { color: COLOR_ESTADO[item.estado] ?? "#6b7280" }]} numberOfLines={1}>
                    {t(`reserva.confirmacion.estados.${item.estado}`, { defaultValue: item.estado })}
                  </Text>
                </View>
              </View>
              <Text style={[styles.tarjetaReferencia, { color: c.textMuted }]}>{item.referencia}</Text>
              <View style={[styles.tarjetaFooter, { borderTopColor: c.border }]}>
                <Text style={[styles.tarjetaTotalLabel, { color: c.textMuted }]}>{t("reserva.confirmacion.totalAPagar")}</Text>
                <Text style={[styles.tarjetaTotal, { color: c.textPrimary }]}>{fmt(item.total)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : !cargando ? (
        <View style={styles.vacioContainer}>
          <View style={[styles.vacioIconoWrap, { backgroundColor: c.primaryBg }]}>
            <Ionicons name="receipt-outline" size={40} color={COLOR_MARCA} />
          </View>
          <Text style={[styles.vacioTitulo, { color: c.textPrimary }]}>{t("misReservas.vacioTitulo")}</Text>
          <Text style={[styles.vacioTexto, { color: c.textMuted }]}>
            {t("misReservas.vacioTexto")}
          </Text>
          <TouchableOpacity
            style={styles.vacioBtnWrap}
            onPress={() => router.push("/(tabs)/catalogo")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={GRADIENTES.boton.colors}
              start={GRADIENTES.boton.start}
              end={GRADIENTES.boton.end}
              style={styles.vacioBtn}
            >
              <Ionicons name="car-sport-outline" size={16} color="#fff" />
              <Text style={styles.vacioBtnText}>{t("misReservas.explorarVehiculos")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitulo: { fontSize: 20, fontWeight: "800" },
  headerSubtitulo: { fontSize: 13, marginTop: 4 },
  lista: { padding: 16, gap: 12 },
  tarjeta: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  tarjetaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  tarjetaVehiculo: { fontSize: 14.5, fontWeight: "800", flexShrink: 1 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 150,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeTexto: { fontSize: 10, fontWeight: "700" },
  tarjetaReferencia: { fontSize: 11, marginTop: 4 },
  tarjetaFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tarjetaTotalLabel: { fontSize: 11 },
  tarjetaTotal: { fontSize: 15, fontWeight: "800" },
  vacioContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  vacioIconoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  vacioTitulo: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  vacioTexto: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },
  vacioBtnWrap: {
    borderRadius: 12,
  },
  vacioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
  },
  vacioBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
