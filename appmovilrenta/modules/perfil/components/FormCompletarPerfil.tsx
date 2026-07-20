import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import { useCompletarPerfil } from "@/modules/perfil/hooks/usePerfil";
import { Nacionalidad, TipoDocumento } from "@/modules/perfil/types/perfil.types";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { InputField } from "@/components/ui/InputField";

const TIPOS_DOCUMENTO: TipoDocumento[] = ["CC", "TI", "Doc. Extranjero", "Pasaporte"];

// Convierte "YYYY-MM-DD" (formato guardado en el form) a un Date real
// para el picker. Si el string está vacío o mal formado, usa una fecha
// por defecto razonable (hace 25 años) en vez de "hoy".
function stringAFecha(valor: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [y, m, d] = valor.split("-").map(Number);
    const fecha = new Date(y, m - 1, d);
    if (!isNaN(fecha.getTime())) return fecha;
  }
  const porDefecto = new Date();
  porDefecto.setFullYear(porDefecto.getFullYear() - 25);
  return porDefecto;
}

// Convierte un Date del picker de vuelta a "YYYY-MM-DD" para guardarlo
// en el form (mismo formato que valida useCompletarPerfil).
function fechaAString(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Formato legible para mostrar en el selector (ej: "12 mar 1998")
function formatearFechaVisible(valor: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "";
  return stringAFecha(valor).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const NACIONALIDADES: { valor: Nacionalidad; bandera: string }[] = [
  { valor: "Colombia",  bandera: "🇨🇴" },
  { valor: "USA",       bandera: "🇺🇸" },
  { valor: "Francia",   bandera: "🇫🇷" },
  { valor: "Portugal",  bandera: "🇵🇹" },
  { valor: "Brasil",    bandera: "🇧🇷" },
];

interface Props {
  onGuardado: () => void;
}

export function FormCompletarPerfil({ onGuardado }: Props) {
  const { t } = useTranslation();
  const c = useTemaColores();
  const { form, errores, cargando, actualizarCampo, guardar } = useCompletarPerfil();
  const [showTipoDoc, setShowTipoDoc] = useState(false);
  const [showNacionalidad, setShowNacionalidad] = useState(false);
  const [showFechaPicker, setShowFechaPicker] = useState(false);

  const handleCambiarFecha = (event: DateTimePickerEvent, fechaSeleccionada?: Date) => {
    // En Android el picker es un diálogo nativo que se cierra solo;
    // en iOS queda embebido, así que solo lo ocultamos al confirmar.
    if (Platform.OS === "android") setShowFechaPicker(false);
    if (event.type === "dismissed") return;
    if (fechaSeleccionada) {
      actualizarCampo("fechaNacimiento", fechaAString(fechaSeleccionada));
    }
  };

  const handleGuardar = () => {
    guardar(
      () => {
        Alert.alert(
          t("perfil.cambiosGuardados"),
          t("perfil.cambiosGuardadosMsg"),
          [{ text: t("perfil.ok"), onPress: onGuardado }]
        );
      },
      () => {
        Alert.alert(t("perfil.errorTitulo"), t("perfil.errorMsg"), [
          { text: t("perfil.errorBtn") },
        ]);
      }
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>

      <InputField
        label={t("perfil.nombres")}
        placeholder="Ej: Laura Vanessa"
        autoCapitalize="words"
        value={form.nombres}
        onChangeText={v => actualizarCampo("nombres", v)}
        error={errores.nombres}
      />
      <InputField
        label={t("perfil.apellidos")}
        placeholder="Ej: Pérez Perdomo"
        autoCapitalize="words"
        value={form.apellidos}
        onChangeText={v => actualizarCampo("apellidos", v)}
        error={errores.apellidos}
      />
      <InputField
        label={t("perfil.telefono")}
        placeholder="3001234567"
        keyboardType="phone-pad"
        value={form.telefono}
        onChangeText={v => actualizarCampo("telefono", v)}
        error={errores.telefono}
      />
      <Text style={[s.label, { color: c.textSecondary }]}>{t("perfil.fechaNac")}</Text>
      <TouchableOpacity
        style={[s.selector, { borderColor: errores.fechaNacimiento ? "#EF4444" : c.border, backgroundColor: c.bgInput }]}
        onPress={() => setShowFechaPicker(true)}
      >
        <Text style={[s.selectorText, { color: form.fechaNacimiento ? c.textPrimary : "#9CA3AF" }]}>
          {form.fechaNacimiento ? formatearFechaVisible(form.fechaNacimiento) : t("perfil.seleccionar")}
        </Text>
        <Text style={{ color: c.textSecondary }}>📅</Text>
      </TouchableOpacity>
      {errores.fechaNacimiento && <Text style={s.error}>{errores.fechaNacimiento}</Text>}

      {showFechaPicker && (
        <DateTimePicker
          value={stringAFecha(form.fechaNacimiento)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={handleCambiarFecha}
        />
      )}
      {showFechaPicker && Platform.OS === "ios" && (
        <TouchableOpacity
          style={[s.botonConfirmarFecha, { backgroundColor: c.primaryBg }]}
          onPress={() => setShowFechaPicker(false)}
        >
          <Text style={s.botonConfirmarFechaTexto}>Listo</Text>
        </TouchableOpacity>
      )}

      {/* Tipo de documento */}
      <Text style={[s.label, { color: c.textSecondary }]}>{t("perfil.tipoDocumento")}</Text>
      <TouchableOpacity
        style={[s.selector, { borderColor: errores.tipoDocumento ? "#EF4444" : c.border, backgroundColor: c.bgInput }]}
        onPress={() => setShowTipoDoc(v => !v)}
      >
        <Text style={[s.selectorText, { color: form.tipoDocumento ? c.textPrimary : "#9CA3AF" }]}>
          {form.tipoDocumento || t("perfil.seleccionar")}
        </Text>
        <Text style={{ color: c.textSecondary }}>▾</Text>
      </TouchableOpacity>
      {showTipoDoc && (
        <View style={[s.dropdown, { borderColor: c.border, backgroundColor: c.bgCard }]}>
          {TIPOS_DOCUMENTO.map(tipo => (
            <TouchableOpacity
              key={tipo}
              style={[s.dropdownItem, form.tipoDocumento === tipo && { backgroundColor: c.primaryBg }]}
              onPress={() => { actualizarCampo("tipoDocumento", tipo); setShowTipoDoc(false); }}
            >
              <Text style={[s.dropdownText, { color: form.tipoDocumento === tipo ? "#1D4ED8" : c.textPrimary }]}>
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errores.tipoDocumento && <Text style={s.error}>{errores.tipoDocumento}</Text>}

      <InputField
        label={t("perfil.numeroDocumento")}
        placeholder="Entre 6 y 10 dígitos"
        keyboardType="numeric"
        value={form.numeroDocumento}
        onChangeText={v => actualizarCampo("numeroDocumento", v)}
        error={errores.numeroDocumento}
      />

      {/* Nacionalidad */}
      <Text style={[s.label, { color: c.textSecondary }]}>{t("perfil.nacionalidad")}</Text>
      <TouchableOpacity
        style={[s.selector, { borderColor: errores.nacionalidad ? "#EF4444" : c.border, backgroundColor: c.bgInput }]}
        onPress={() => setShowNacionalidad(v => !v)}
      >
        <Text style={[s.selectorText, { color: form.nacionalidad ? c.textPrimary : "#9CA3AF" }]}>
          {form.nacionalidad
            ? `${NACIONALIDADES.find(n => n.valor === form.nacionalidad)?.bandera} ${form.nacionalidad}`
            : t("perfil.seleccionar")}
        </Text>
        <Text style={{ color: c.textSecondary }}>▾</Text>
      </TouchableOpacity>
      {showNacionalidad && (
        <View style={[s.dropdown, { borderColor: c.border, backgroundColor: c.bgCard }]}>
          {NACIONALIDADES.map(({ valor, bandera }) => (
            <TouchableOpacity
              key={valor}
              style={[s.dropdownItem, form.nacionalidad === valor && { backgroundColor: c.primaryBg }]}
              onPress={() => { actualizarCampo("nacionalidad", valor); setShowNacionalidad(false); }}
            >
              <Text style={[s.dropdownText, { color: form.nacionalidad === valor ? "#1D4ED8" : c.textPrimary }]}>
                {bandera} {valor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errores.nacionalidad && <Text style={s.error}>{errores.nacionalidad}</Text>}

      <View style={{ marginTop: 24 }}>
        <PrimaryButton titulo={t("perfil.guardarDatos")} onPress={handleGuardar} cargando={cargando} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 4,
  },
  selectorText: {
    fontSize: 14,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: "500",
  },
  error: {
    fontSize: 12,
    color: "#EF4444",
    marginBottom: 8,
    marginTop: 2,
  },
  botonConfirmarFecha: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  botonConfirmarFechaTexto: {
    color: "#1D4ED8",
    fontWeight: "700",
    fontSize: 13,
  },
});
