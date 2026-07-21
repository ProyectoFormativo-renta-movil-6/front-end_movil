// components/ui/DateField.tsx
//
// Input de fecha multiplataforma para el formulario de perfil:
//  - Web (Expo Web): usa un <input type="date"> nativo del navegador,
//    con su propio selector de calendario y validación de formato.
//  - iOS / Android: usa @react-native-community/datetimepicker, que ya
//    se usaba en el formulario de "Completar perfil".
//
// El valor siempre se maneja como string "YYYY-MM-DD" (mismo formato que
// ya validaba el resto del módulo de perfil).

import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export function stringAFecha(valor: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [y, m, d] = valor.split("-").map(Number);
    const fecha = new Date(y, m - 1, d);
    if (!isNaN(fecha.getTime())) return fecha;
  }
  const porDefecto = new Date();
  porDefecto.setFullYear(porDefecto.getFullYear() - 25);
  return porDefecto;
}

export function fechaAString(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatearFechaVisible(valor: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "";
  return stringAFecha(valor).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface ColoresTema {
  border: string;
  bgInput: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primaryBg: string;
  primary: string;
  /** Si el tema activo de la app es oscuro. Se usa para fijar el
   *  color-scheme del <input type="date"> nativo del navegador — sin
   *  esto, el navegador decide con la preferencia del SISTEMA operativo,
   *  no con el tema elegido dentro de la app, y eso puede volver
   *  invisibles el texto/ícono del selector cuando ambos no coinciden
   *  (ej: app en modo claro pero el SO en modo oscuro). */
  oscuro?: boolean;
}

interface Props {
  label: string;
  value: string; // "YYYY-MM-DD"
  onChange: (valor: string) => void;
  error?: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  colores: ColoresTema;
}

export function DateField({
  label,
  value,
  onChange,
  error,
  placeholder = "Seleccionar...",
  maximumDate,
  minimumDate,
  colores: c,
}: Props) {
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const handleCambiarFecha = (event: DateTimePickerEvent, fechaSeleccionada?: Date) => {
    // En Android el picker es un diálogo nativo que se cierra solo;
    // en iOS queda embebido, así que solo lo ocultamos al confirmar.
    if (Platform.OS === "android") setMostrarPicker(false);
    if (event.type === "dismissed") return;
    if (fechaSeleccionada) onChange(fechaAString(fechaSeleccionada));
  };

  // ── Web: input tipo fecha nativo del navegador ─────────────────────────
  if (Platform.OS === "web") {
    // El texto interno que dibuja el navegador dentro de un
    // <input type="date"> (día/mes/año) NO siempre respeta la propiedad
    // CSS "color" — en varios navegadores (Chrome/Edge incluidos) ese
    // texto se pinta solo según "color-scheme", ignorando por completo
    // cualquier color que le pongamos. Eso es lo que causaba el bug:
    // en modo claro el texto podía salir en blanco sobre fondo blanco.
    //
    // Solución: dejamos el <input> nativo ahí (para que siga abriendo el
    // calendario del navegador al hacer click), pero le hacemos el texto
    // transparente y dibujamos NOSOTROS el valor encima con un <Text>
    // normal de React Native, que sí respeta el color del tema al 100%.
    return (
      <View style={s.wrap}>
        <Text style={[s.label, { color: c.textSecondary }]}>{label}</Text>
        <View style={{ position: "relative", justifyContent: "center" }}>
          {/* Elemento HTML nativo — capta el click y abre el calendario,
              pero su texto queda invisible a propósito (ver arriba). */}
          {React.createElement("input", {
            type: "date",
            value: value || "",
            max: maximumDate ? fechaAString(maximumDate) : undefined,
            min: minimumDate ? fechaAString(minimumDate) : undefined,
            onChange: (e: any) => onChange(e.target.value),
            style: {
              border: `1px solid ${error ? "#EF4444" : c.border}`,
              backgroundColor: c.bgInput,
              color: "transparent",
              WebkitTextFillColor: "transparent",
              caretColor: "transparent",
              borderRadius: 10,
              padding: "13px 14px",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
              // Ayuda a que el ícono del calendario y el popup emergente
              // del navegador combinen con el tema de la app.
              colorScheme: c.oscuro ? "dark" : "light",
            },
          })}
          {/* Nuestro propio texto, siempre visible, encima del input */}
          <View pointerEvents="none" style={s.webOverlay}>
            <Text style={[s.selectorText, { color: value ? c.textPrimary : c.textMuted }]} numberOfLines={1}>
              {value ? formatearFechaVisible(value) : placeholder}
            </Text>
          </View>
        </View>
        {error ? <Text style={s.error}>{error}</Text> : null}
      </View>
    );
  }

  // ── iOS / Android: selector nativo con DateTimePicker ──────────────────
  return (
    <View style={s.wrap}>
      <Text style={[s.label, { color: c.textSecondary }]}>{label}</Text>
      <TouchableOpacity
        style={[s.selector, { borderColor: error ? "#EF4444" : c.border, backgroundColor: c.bgInput }]}
        onPress={() => setMostrarPicker(true)}
      >
        <Text style={[s.selectorText, { color: value ? c.textPrimary : c.textMuted }]}>
          {value ? formatearFechaVisible(value) : placeholder}
        </Text>
        <Text style={{ color: c.textSecondary }}>📅</Text>
      </TouchableOpacity>
      {error ? <Text style={s.error}>{error}</Text> : null}

      {mostrarPicker && (
        <DateTimePicker
          value={stringAFecha(value)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleCambiarFecha}
        />
      )}
      {mostrarPicker && Platform.OS === "ios" && (
        <TouchableOpacity
          style={[s.botonListo, { backgroundColor: c.primaryBg }]}
          onPress={() => setMostrarPicker(false)}
        >
          <Text style={[s.botonListoTexto, { color: c.primary }]}>Listo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 4 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  webOverlay: {
    position: "absolute",
    left: 14,
    right: 36,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  selectorText: { fontSize: 14 },
  error: { fontSize: 12, color: "#EF4444", marginTop: 4 },
  botonListo: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  botonListoTexto: { fontWeight: "700", fontSize: 13 },
});
