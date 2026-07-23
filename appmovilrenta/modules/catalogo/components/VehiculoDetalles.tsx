// modules/catalogo/components/VehiculoDetalles.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { COLORES } from "../constants/catalogo.constants";
import { Vehiculo } from "../types/catalogo.types";
import { useMonedaStore } from "@/store/monedaStore";
import { formatCurrency } from "@/utils/monedaUtils";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";

interface Props {
  vehiculo: Vehiculo;
}

function formatPrecio(precio: number): string {
  const { monedaActual, tasaUSD } = useMonedaStore.getState();
  return formatCurrency(precio, monedaActual, tasaUSD);
}

export default function VehiculoDetalles({ vehiculo }: Props) {
  // Nos suscribimos al store de moneda para re-renderizar los precios
  // cuando cambie COP↔USD o llegue una tasa nueva.
  useMonedaStore();
  const c = useTemaColores();
  const { t } = useTranslation();
  const tarifas = vehiculo.tarifas ?? {};
  const seguros = vehiculo.seguros ?? [];

  const caracteristicas: { icono: React.ReactNode; label: string }[] = [];

  if (vehiculo.aireAcondicionado)
    caracteristicas.push({
      icono: <Ionicons name="snow-outline" size={14} color="#2f4ea2" />,
      label: t("catalogo.detalles.aireAcondicionado"),
    });
  if (vehiculo.vidriosElectricos)
    caracteristicas.push({
      icono: <Ionicons name="flash-outline" size={14} color="#2f4ea2" />,
      label: t("catalogo.detalles.vidriosElectricos"),
    });
  if (vehiculo.cierreCentralizado)
    caracteristicas.push({
      icono: <Ionicons name="lock-closed-outline" size={14} color="#2f4ea2" />,
      label: t("catalogo.detalles.cierreCentralizado"),
    });
  if (vehiculo.maletero)
    caracteristicas.push({
      icono: (
        <MaterialCommunityIcons
          name="bag-suitcase-outline"
          size={14}
          color="#2f4ea2"
        />
      ),
      label: `${vehiculo.maletero}L ${t("catalogo.detalles.maletero")}`,
    });
  if (vehiculo.transmision)
    caracteristicas.push({
      icono: <Ionicons name="settings-outline" size={14} color="#2f4ea2" />,
      label: t(`catalogo.transmisionValores.${vehiculo.transmision}`, { defaultValue: vehiculo.transmision }),
    });
  if (vehiculo.combustible)
    caracteristicas.push({
      icono: (
        <MaterialCommunityIcons
          name="gas-station-outline"
          size={14}
          color="#2f4ea2"
        />
      ),
      label: t(`catalogo.combustibleValores.${vehiculo.combustible}`, { defaultValue: vehiculo.combustible }),
    });
  if (vehiculo.pasajeros)
    caracteristicas.push({
      icono: <Ionicons name="people-outline" size={14} color="#2f4ea2" />,
      label: `${vehiculo.pasajeros} ${t("catalogo.detalles.personas")}`,
    });

  const filas: (typeof caracteristicas)[] = [];
  for (let i = 0; i < caracteristicas.length; i += 2) {
    filas.push(caracteristicas.slice(i, i + 2));
  }

  return (
    <View style={{ marginTop: 4 }}>
      <Text style={[styles.nombre, { color: c.textPrimary }]}>{vehiculo.nombre}</Text>

      {filas.length > 0 && (
        <View style={styles.caracteristicasGrid}>
          {filas.map((fila, fi) => (
            <View key={fi} style={styles.caracteristicasFila}>
              {fila.map((item, ci) => (
                <View key={ci} style={[styles.caracteristicaChip, { backgroundColor: c.bgInput, borderColor: c.border }]}>
                  {item.icono}
                  <Text style={[styles.caracteristicaChipText, { color: c.textSecondary }]}>
                    {item.label}
                  </Text>
                </View>
              ))}
              {fila.length === 1 && (
                <View style={styles.caracteristicaChipVacio} />
              )}
            </View>
          ))}
        </View>
      )}

      <View style={[styles.seccionDetalle, { backgroundColor: c.oscuro ? "#0F2A1C" : "#f4fbf7", borderColor: c.oscuro ? "#1F4D34" : "#ccf1dc" }]}>
        <View style={styles.seccionDetalleHeader}>
          <Ionicons name="cash-outline" size={14} color="#22C55E" />
          <Text style={[styles.seccionDetalleTitulo, { color: "#22C55E" }]}>{t("catalogo.detalles.tarifas")}</Text>
        </View>
        {tarifas.kmLimitado && (
          <View style={styles.tarifaRow}>
            <Text style={[styles.tarifaLabel, { color: c.textSecondary }]}>
              {t("catalogo.detalles.kmLimitado")} ({tarifas.kmLimitado.km} {t("catalogo.detalles.kmDia")})
            </Text>
            <Text style={[styles.tarifaValor, { color: c.textPrimary }]}>
              {formatPrecio(tarifas.kmLimitado.precio)}
            </Text>
          </View>
        )}
        {tarifas.kmIlimitado && (
          <View style={styles.tarifaRow}>
            <Text style={[styles.tarifaLabel, { color: c.textSecondary }]}>{t("catalogo.detalles.kmIlimitado")}</Text>
            <Text style={[styles.tarifaValor, { color: c.textPrimary }]}>
              {formatPrecio(tarifas.kmIlimitado.precio)}
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.seccionDetalle,
          { backgroundColor: c.oscuro ? "#131B33" : "#f0f4ff", borderColor: c.oscuro ? "#28345C" : "#ccd9ff" },
        ]}
      >
        <View style={styles.seccionDetalleHeader}>
          <Ionicons name="shield-checkmark-outline" size={14} color="#5B8DEF" />
          <Text style={[styles.seccionDetalleTitulo, { color: "#5B8DEF" }]}>
            {t("catalogo.detalles.seguros")}
          </Text>
        </View>
        {seguros.length > 0 ? (
          seguros.map((seg, i) => (
            <View key={i} style={styles.tarifaRow}>
              <Text style={[styles.tarifaLabel, { color: c.textSecondary }]}>{t(`reserva.planes.nombreSeguro.${seg.nombre}`, { defaultValue: seg.nombre })}</Text>
              <Text style={[styles.tarifaValor, { color: c.textPrimary }]}>
                {formatPrecio(seg.precio)}/{t("catalogo.porDia")}
              </Text>
            </View>
          ))
        ) : (
          <>
            <View style={styles.tarifaRow}>
              <Text style={[styles.tarifaLabel, { color: c.textSecondary }]}>{t("catalogo.detalles.proteccionObligatoria")}</Text>
              <Text style={[styles.tarifaValor, { color: c.textPrimary }]}>$29.000/dia</Text>
            </View>
            <View style={styles.tarifaRow}>
              <Text style={[styles.tarifaLabel, { color: c.textSecondary }]}>{t("catalogo.detalles.proteccionTotal")}</Text>
              <Text style={[styles.tarifaValor, { color: c.textPrimary }]}>$67.000/dia</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nombre: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORES.textPrimary,
    marginBottom: 12,
  },
  caracteristicasGrid: { marginBottom: 12, gap: 8 },
  caracteristicasFila: { flexDirection: "row", gap: 8 },
  caracteristicaChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  caracteristicaChipVacio: { flex: 1 },
  caracteristicaChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    flexShrink: 1,
  },
  seccionDetalle: {
    backgroundColor: "#f4fbf7",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccf1dc",
    marginBottom: 10,
  },
  seccionDetalleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  seccionDetalleTitulo: {
    fontSize: 11,
    fontWeight: "800",
    color: "#137333",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tarifaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  tarifaLabel: { fontSize: 12, color: "#334155", fontWeight: "600", flex: 1 },
  tarifaValor: { fontSize: 12, fontWeight: "800", color: "#1e3a8a" },
});