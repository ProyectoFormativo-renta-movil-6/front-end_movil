import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { COLOR_MARCA, COLORES } from "../constants/reserva.constants";

interface Props {
  vehiculo: Vehiculo;
  fechaRetiro: string | null;
  fechaDevolucion: string | null;
  onCambiarFechas: (fechaRetiro: string | null, fechaDevolucion: string | null) => void;
}

const COLOR_DISPONIBLE = "#16a34a";
const COLOR_RESERVADO = "#dc2626";
const COLOR_MANTENIMIENTO = "#64748b";

function getDiasEnRango(inicio: string, fin: string): string[] {
  const dias: string[] = [];
  const cursor = new Date(inicio + "T00:00:00");
  const finDate = new Date(fin + "T00:00:00");
  while (cursor <= finDate) {
    dias.push(cursor.toISOString().split("T")[0]);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dias;
}

export default function CalendarioRango({
  vehiculo,
  fechaRetiro,
  fechaDevolucion,
  onCambiarFechas,
}: Props) {
  // Mapa fecha -> motivo ("reservado" | "mantenimiento"), para poder pintar
  // y explicar cada bloqueo según su causa real.
  const ocupados = useMemo(() => {
    const mapa = new Map<string, "reservado" | "mantenimiento">();
    (vehiculo.disponibilidad?.ocupados ?? []).forEach((item) => {
      mapa.set(item.fecha, item.motivo);
    });
    return mapa;
  }, [vehiculo]);

  const hoy = new Date().toISOString().split("T")[0];

  const mensajePorMotivo = (motivo: "reservado" | "mantenimiento") =>
    motivo === "mantenimiento"
      ? "Este vehículo se encuentra en mantenimiento en la fecha seleccionada."
      : "Este vehículo ya está reservado en la fecha seleccionada.";

  const alertarNoDisponible = (titulo: string, motivo: "reservado" | "mantenimiento") => {
    Alert.alert(titulo, mensajePorMotivo(motivo), [
      { text: "Intentar de nuevo", style: "default" },
    ]);
  };

  const handleDayPress = (day: DateData) => {
    const fecha = day.dateString;
    const motivo = ocupados.get(fecha);

    if (motivo) {
      alertarNoDisponible("Fecha no disponible", motivo);
      return;
    }

    if (!fechaRetiro || (fechaRetiro && fechaDevolucion)) {
      onCambiarFechas(fecha, null);
      return;
    }

    if (fecha < fechaRetiro) {
      onCambiarFechas(fecha, null);
      return;
    }

    const rango = getDiasEnRango(fechaRetiro, fecha);
    const motivoEnMedio = rango.map((d) => ocupados.get(d)).find(Boolean);
    if (motivoEnMedio) {
      Alert.alert(
        "Rango no disponible",
        motivoEnMedio === "mantenimiento"
          ? "Hay fechas en mantenimiento dentro del rango seleccionado. Elige otras fechas."
          : "Hay fechas ya reservadas dentro del rango seleccionado. Elige otras fechas.",
        [{ text: "Intentar de nuevo", style: "default" }]
      );
      onCambiarFechas(fecha, null);
      return;
    }

    onCambiarFechas(fechaRetiro, fecha);
  };

  const markedDates = useMemo(() => {
    const marcas: Record<string, any> = {};

    ocupados.forEach((motivo, fecha) => {
      marcas[fecha] = {
        marked: true,
        dotColor: motivo === "mantenimiento" ? COLOR_MANTENIMIENTO : COLOR_RESERVADO,
      };
    });

    if (fechaRetiro && fechaDevolucion) {
      const rango = getDiasEnRango(fechaRetiro, fechaDevolucion);
      rango.forEach((fecha, i) => {
        marcas[fecha] = {
          color: COLOR_MARCA,
          textColor: "#fff",
          startingDay: i === 0,
          endingDay: i === rango.length - 1,
        };
      });
    } else if (fechaRetiro) {
      marcas[fechaRetiro] = {
        color: COLOR_MARCA,
        textColor: "#fff",
        startingDay: true,
        endingDay: true,
      };
    }

    return marcas;
  }, [ocupados, fechaRetiro, fechaDevolucion]);

  return (
    <View style={styles.container}>
      <Calendar
        current={hoy}
        minDate={hoy}
        markingType="period"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: COLOR_MARCA,
          arrowColor: COLORES.textSecondary,
          textDayFontSize: 13,
          textMonthFontSize: 14,
          textMonthFontWeight: "700",
          textDayHeaderFontSize: 11,
        }}
        style={styles.calendar}
      />

      <View style={styles.leyenda}>
        <View style={styles.leyendaItem}>
          <View style={[styles.dot, { backgroundColor: COLOR_DISPONIBLE }]} />
          <Text style={styles.leyendaText}>Disponible</Text>
        </View>
        <View style={styles.leyendaItem}>
          <View style={[styles.dot, { backgroundColor: COLOR_RESERVADO }]} />
          <Text style={styles.leyendaText}>Reservado</Text>
        </View>
        <View style={styles.leyendaItem}>
          <View style={[styles.dot, { backgroundColor: COLOR_MANTENIMIENTO }]} />
          <Text style={styles.leyendaText}>Mantenimiento</Text>
        </View>
        <View style={styles.leyendaItem}>
          <View style={[styles.dot, { backgroundColor: COLOR_MARCA }]} />
          <Text style={styles.leyendaText}>Seleccionado</Text>
        </View>
      </View>

      {!fechaRetiro && (
        <Text style={styles.avisoTexto}>Debes seleccionar las fechas de retiro y devolución</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    borderRadius: 14,
    padding: 8,
    backgroundColor: COLORES.panelBg,
  },
  calendar: { borderRadius: 10 },
  leyenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginTop: 4,
    marginBottom: 6,
  },
  leyendaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  leyendaText: { fontSize: 10, color: COLORES.textSecondary },
  avisoTexto: {
    fontSize: 11,
    color: "#dc2626",
    textAlign: "right",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
});