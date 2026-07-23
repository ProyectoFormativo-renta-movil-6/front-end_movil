// app/pago-respuesta.tsx
//
// Pantalla a la que vuelve el usuario después del checkout de Wompi.
// Equivalente a src/modules/payments/pages/RespuestaPagoPage.jsx en la web:
// lee la reserva guardada localmente por su referencia y muestra el estado
// del pago (Wompi confirma la transacción de forma asíncrona vía webhook
// en el backend real; acá solo reflejamos que quedó "en validación").
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import { GRADIENTES } from "@/constants/gradients";
import { COLOR_MARCA } from "@/modules/catalogo/constants/catalogo.constants";
import {
  ReservaGuardada,
  reservaPersistService,
} from "@/modules/reserva/services/reservaPersistService";
import { fmt } from "@/modules/reserva/components/ResumenReservaModal.piezas";

export default function PagoRespuestaScreen() {
  const insets = useSafeAreaInsets();
  const c = useTemaColores();
  const { t } = useTranslation();
  const { ref } = useLocalSearchParams<{ ref?: string }>();

  const [cargando, setCargando] = useState(true);
  const [reserva, setReserva] = useState<ReservaGuardada | null>(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      if (!ref) {
        setCargando(false);
        return;
      }
      const encontrada = await reservaPersistService.obtenerPorReferencia(ref);
      if (activo) {
        setReserva(encontrada ?? null);
        setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, [ref]);

  const irAMisReservas = () => router.replace("/(tabs)/mis-reservas");

  if (cargando) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLOR_MARCA} />
        <Text style={[styles.procesandoTexto, { color: c.textSecondary }]}>
          {t("reserva.confirmacion.respuesta.procesando")}
        </Text>
      </View>
    );
  }

  if (!reserva) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg, paddingTop: insets.top, paddingHorizontal: 32 }]}>
        <Ionicons name="help-circle-outline" size={56} color={c.textMuted} />
        <Text style={[styles.tituloVacio, { color: c.textPrimary }]}>
          {t("reserva.confirmacion.respuesta.noEncontrada")}
        </Text>
        <Text style={[styles.textoVacio, { color: c.textMuted }]}>
          {t("reserva.confirmacion.respuesta.noEncontradaMensaje")}
        </Text>
        <TouchableOpacity style={styles.btnWrap} onPress={irAMisReservas} activeOpacity={0.85}>
          <LinearGradient
            colors={GRADIENTES.boton.colors}
            start={GRADIENTES.boton.start}
            end={GRADIENTES.boton.end}
            style={styles.btn}
          >
            <Text style={styles.btnTexto}>{t("reserva.confirmacion.respuesta.volverAMisReservas")}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const estadoTexto = t(`reserva.confirmacion.estados.${reserva.estado}`, {
    defaultValue: reserva.estado,
  });

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24 }]}
    >
      <View style={[styles.iconoWrap, { backgroundColor: c.primaryBg }]}>
        <Ionicons name="time-outline" size={40} color={COLOR_MARCA} />
      </View>

      <Text style={[styles.titulo, { color: c.textPrimary }]}>
        {t("reserva.confirmacion.respuesta.exitoTitulo")}
      </Text>
      <Text style={[styles.subtitulo, { color: c.textSecondary }]}>
        {t("reserva.confirmacion.respuesta.exitoMensaje")}
      </Text>

      <View style={[styles.card, { backgroundColor: c.bgCard, borderColor: c.border }]}>
        <FilaDetalle
          label={t("reserva.confirmacion.respuesta.vehiculo")}
          valor={reserva.vehiculoNombre}
          c={c}
        />
        <FilaDetalle
          label={t("reserva.confirmacion.respuesta.referencia")}
          valor={reserva.referencia}
          c={c}
        />
        {reserva.paymentId ? (
          <FilaDetalle
            label={t("reserva.confirmacion.respuesta.idTransaccion")}
            valor={String(reserva.paymentId)}
            c={c}
          />
        ) : null}
        <FilaDetalle
          label={t("reserva.confirmacion.respuesta.total")}
          valor={fmt(reserva.total)}
          c={c}
        />
        <FilaDetalle
          label={t("reserva.confirmacion.respuesta.estado")}
          valor={estadoTexto}
          c={c}
          ultima
        />
      </View>

      <TouchableOpacity style={styles.btnWrap} onPress={irAMisReservas} activeOpacity={0.85}>
        <LinearGradient
          colors={GRADIENTES.boton.colors}
          start={GRADIENTES.boton.start}
          end={GRADIENTES.boton.end}
          style={styles.btn}
        >
          <Text style={styles.btnTexto}>{t("reserva.confirmacion.respuesta.volverAMisReservas")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

function FilaDetalle({
  label,
  valor,
  c,
  ultima,
}: {
  label: string;
  valor: string;
  c: ReturnType<typeof useTemaColores>;
  ultima?: boolean;
}) {
  return (
    <View style={[filaS.fila, !ultima && { borderBottomWidth: 1, borderBottomColor: c.border }]}>
      <Text style={[filaS.label, { color: c.textMuted }]}>{label}</Text>
      <Text style={[filaS.valor, { color: c.textPrimary }]} numberOfLines={1}>
        {valor}
      </Text>
    </View>
  );
}

const filaS = StyleSheet.create({
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  label: { fontSize: 12.5 },
  valor: { fontSize: 12.5, fontWeight: "700", flexShrink: 1, textAlign: "right" },
});

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  procesandoTexto: { fontSize: 14 },
  tituloVacio: { fontSize: 17, fontWeight: "800", marginTop: 12, textAlign: "center" },
  textoVacio: { fontSize: 13, marginTop: 6, textAlign: "center", lineHeight: 19 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40, alignItems: "center" },
  iconoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titulo: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  subtitulo: { fontSize: 13.5, textAlign: "center", marginTop: 8, lineHeight: 19, marginBottom: 20 },
  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  btnWrap: { width: "100%", borderRadius: 12 },
  btn: { paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  btnTexto: { color: "#fff", fontSize: 14.5, fontWeight: "800" },
});
