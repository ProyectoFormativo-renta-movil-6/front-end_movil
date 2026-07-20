import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { GRADIENTES } from "@/constants/gradients";
import { CIUDADES, SUCURSALES_DATA } from "../constants/catalogo.constants";
import { BusquedaForm } from "../types/catalogo.types";

type PickerField = "ciudad" | "sucursal" | null;

function formatFechaDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function getMarkedDates(inicio: string, fin: string) {
  if (!inicio) return {};

  if (!fin) {
    return {
      [inicio]: {
        startingDay: true,
        endingDay: true,
        color: "#2f4ea2",
        textColor: "#fff",
      },
    };
  }

  const marked: Record<string, any> = {};
  let cursor = new Date(inicio + "T00:00:00");
  const fechaFinDate = new Date(fin + "T00:00:00");

  while (cursor <= fechaFinDate) {
    const dateStr = cursor.toISOString().split("T")[0];
    const esInicio = dateStr === inicio;
    const esFin = dateStr === fin;
    marked[dateStr] = {
      color: esInicio || esFin ? "#2f4ea2" : "#BFDBFE",
      textColor: esInicio || esFin ? "#fff" : "#1e3a8a",
      startingDay: esInicio,
      endingDay: esFin,
    };
    cursor.setDate(cursor.getDate() + 1);
  }

  return marked;
}

interface Props {
  form: BusquedaForm;
  setForm: (campo: keyof BusquedaForm, valor: string | boolean) => void;
  onBuscar: () => void;
  onLimpiarBusqueda: () => void;
  textBusqueda: string;
  setTextBusqueda: (texto: string) => void;
  errorBusqueda?: string;
  disabled?: boolean;
  modalFormVisible: boolean;
  setModalFormVisible: (visible: boolean) => void;
  onPressRestringida?: () => void;
}

export default function BuscadorCatalogo({
  form,
  setForm,
  onBuscar,
  onLimpiarBusqueda,
  textBusqueda,
  setTextBusqueda,
  errorBusqueda,
  disabled = false,
  modalFormVisible,
  setModalFormVisible,
  onPressRestringida,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState<PickerField>(null);

  const ciudadSeleccionada = form.lugarRecogida;
  const sucursalSeleccionada = form.lugarDevolucion;

  const sucursalesDeLaCiudad = ciudadSeleccionada
    ? SUCURSALES_DATA.filter((s) => s.ciudad === ciudadSeleccionada).map(
        (s) => s.nombre,
      )
    : [];

  const currentSelected =
    pickerOpen === "ciudad" ? ciudadSeleccionada : sucursalSeleccionada;

  const tieneBusquedaActiva = !!(
    form.lugarRecogida ||
    form.lugarDevolucion ||
    form.fechaInicio ||
    form.fechaFin
  );

  const limpiarFormulario = () => {
    onLimpiarBusqueda();
  };

  const selectPunto = (valor: string) => {
    if (pickerOpen === "ciudad") {
      setForm("lugarRecogida", valor);
      setForm("lugarDevolucion", "");
    } else {
      setForm("lugarDevolucion", valor);
    }
    setPickerOpen(null);
  };

  const onDayPress = (day: DateData) => {
    if (disabled) return;
    const dateStr = day.dateString;

    if (!form.fechaInicio || (form.fechaInicio && form.fechaFin)) {
      setForm("fechaInicio", dateStr);
      setForm("fechaFin", "");
      return;
    }

    if (dateStr < form.fechaInicio) {
      setForm("fechaInicio", dateStr);
      setForm("fechaFin", "");
    } else {
      setForm("fechaFin", dateStr);
    }
  };

  const fechaBtnLabel = tieneBusquedaActiva
    ? [
        form.lugarRecogida,
        form.lugarDevolucion,
        formatFechaDisplay(form.fechaInicio),
        formatFechaDisplay(form.fechaFin),
      ]
        .filter(Boolean)
        .join(" · ")
    : disabled
      ? "Inicia sesión para consultar disponibilidad"
      : "Consultar disponibilidad";

  const handlePressFechas = () => {
    if (disabled) {
      onPressRestringida?.();
    } else {
      setModalFormVisible(true);
    }
  };

  const abrirPickerSucursal = () => {
    if (!ciudadSeleccionada) return;
    setPickerOpen("sucursal");
  };

  const hoyISO = new Date().toISOString().split("T")[0];

  return (
    <View style={styles.containerGeneral}>
      <View style={styles.barraInput}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Buscar por marca o modelo..."
          placeholderTextColor="#9CA3AF"
          value={textBusqueda}
          onChangeText={setTextBusqueda}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.fechasBarraBtn,
          disabled && styles.fechasBarraBtnDisabled,
          tieneBusquedaActiva && styles.fechasBarraBtnActiva,
        ]}
        activeOpacity={0.7}
        onPress={handlePressFechas}
      >
        <Ionicons
          name={
            disabled
              ? "lock-closed-outline"
              : tieneBusquedaActiva
                ? "calendar"
                : "calendar-outline"
          }
          size={16}
          color={
            disabled ? "#9CA3AF" : tieneBusquedaActiva ? "#2f4ea2" : "#9CA3AF"
          }
          style={{ marginRight: 8 }}
        />
        <Text
          style={[
            styles.fechasBarraBtnText,
            tieneBusquedaActiva && styles.fechasBarraBtnTextActivo,
          ]}
          numberOfLines={1}
        >
          {fechaBtnLabel}
        </Text>
        <Ionicons name="chevron-forward" size={14} color="#C4C9D4" />
      </TouchableOpacity>

      <Modal
        visible={modalFormVisible}
        animationType="slide"
        onRequestClose={() => setModalFormVisible(false)}
      >
        <SafeAreaView style={styles.modalFormContainer}>
          <View style={styles.modalFormHeader}>
            <TouchableOpacity onPress={() => setModalFormVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalFormTitle}>Consultar Disponibilidad</Text>
            {tieneBusquedaActiva ? (
              <TouchableOpacity onPress={limpiarFormulario}>
                <Text style={styles.txtLimpiarModal}>Limpiar</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 45 }} />
            )}
          </View>

          <View style={styles.modalFormBody}>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>CIUDAD</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setPickerOpen("ciudad")}
                >
                  <Ionicons name="location-outline" size={14} color="#2f4ea2" />
                  <Text
                    style={[
                      styles.selectorText,
                      !ciudadSeleccionada && styles.placeholder,
                    ]}
                    numberOfLines={1}
                  >
                    {ciudadSeleccionada || "Selecciona ciudad"}
                  </Text>
                  <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>SUCURSAL</Text>
                <TouchableOpacity
                  style={[
                    styles.selector,
                    !ciudadSeleccionada && styles.selectorDisabled,
                  ]}
                  onPress={abrirPickerSucursal}
                  disabled={!ciudadSeleccionada}
                >
                  <Ionicons
                    name="business-outline"
                    size={14}
                    color={ciudadSeleccionada ? "#2f4ea2" : "#C4C9D4"}
                  />
                  <Text
                    style={[
                      styles.selectorText,
                      !sucursalSeleccionada && styles.placeholder,
                    ]}
                    numberOfLines={1}
                  >
                    {!ciudadSeleccionada
                      ? "Selecciona ciudad primero"
                      : sucursalSeleccionada || "Selecciona sucursal"}
                  </Text>
                  <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>FECHA RECOGIDA</Text>
                <View style={styles.dateBtn}>
                  <Ionicons name="calendar-outline" size={14} color="#2f4ea2" />
                  <Text
                    style={[
                      styles.dateBtnText,
                      !form.fechaInicio && styles.placeholder,
                    ]}
                  >
                    {form.fechaInicio
                      ? formatFechaDisplay(form.fechaInicio)
                      : "dd/mm/aaaa"}
                  </Text>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>FECHA DEVOLUCIÓN</Text>
                <View style={styles.dateBtn}>
                  <Ionicons name="calendar-outline" size={14} color="#2f4ea2" />
                  <Text
                    style={[
                      styles.dateBtnText,
                      !form.fechaFin && styles.placeholder,
                    ]}
                  >
                    {form.fechaFin
                      ? formatFechaDisplay(form.fechaFin)
                      : "dd/mm/aaaa"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.calendarioContainer}>
              <Calendar
                minDate={hoyISO}
                onDayPress={onDayPress}
                markingType="period"
                markedDates={getMarkedDates(form.fechaInicio, form.fechaFin)}
                firstDay={1}
                enableSwipeMonths
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  todayTextColor: "#2f4ea2",
                  todayBackgroundColor: "#EFF6FF",
                  arrowColor: "#2f4ea2",
                  monthTextColor: "#111827",
                  textMonthFontWeight: "700",
                  textMonthFontSize: 15,
                  textSectionTitleColor: "#6B7280",
                  textDayHeaderFontWeight: "600",
                  textDayHeaderFontSize: 11,
                  dayTextColor: "#1F2937",
                  textDisabledColor: "#D1D5DB",
                  textDayFontSize: 13,
                  textDayFontWeight: "500",
                }}
              />
            </View>

            <TouchableOpacity
              style={styles.buscarBtnGrandeWrap}
              onPress={() => {
                setModalFormVisible(false);
                onBuscar();
              }}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={GRADIENTES.boton.colors}
                start={GRADIENTES.boton.start}
                end={GRADIENTES.boton.end}
                style={styles.buscarBtnGrande}
              >
                <Ionicons name="search" size={18} color="#fff" />
                <Text style={styles.buscarBtnGrandeTexto}>Buscar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <Modal visible={!!pickerOpen} animationType="fade" transparent>
          <View style={styles.modalOverlayInterno}>
            <View style={styles.modalInternoContenedor}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {pickerOpen === "ciudad"
                    ? "Selecciona ciudad"
                    : "Selecciona sucursal"}
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setPickerOpen(null)}
                >
                  <Ionicons name="close" size={20} color="#374151" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={pickerOpen === "ciudad" ? CIUDADES : sucursalesDeLaCiudad}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.puntoItem,
                      currentSelected === item && styles.puntoItemActivo,
                    ]}
                    onPress={() => selectPunto(item)}
                  >
                    <Ionicons
                      name={
                        pickerOpen === "ciudad"
                          ? "location-outline"
                          : "business-outline"
                      }
                      size={16}
                      color={currentSelected === item ? "#2f4ea2" : "#9CA3AF"}
                    />
                    <Text
                      style={[
                        styles.puntoText,
                        currentSelected === item && styles.puntoTextActivo,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerGeneral: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  barraInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 48,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  textInput: { flex: 1, fontSize: 14, color: "#1F2937", height: "100%" },
  fechasBarraBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 44,
    paddingHorizontal: 12,
  },
  fechasBarraBtnDisabled: { backgroundColor: "#F3F4F6" },
  fechasBarraBtnActiva: { borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" },
  fechasBarraBtnText: { flex: 1, fontSize: 13.5, color: "#9CA3AF", fontWeight: "500" },
  fechasBarraBtnTextActivo: { color: "#2f4ea2", fontWeight: "600" },
  placeholder: { color: "#9CA3AF" },
  modalFormContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  modalFormHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalFormTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  txtLimpiarModal: { fontSize: 14, color: "#2f4ea2", fontWeight: "600" },
  modalFormBody: { padding: 20, gap: 16 },
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1 },
  label: { fontSize: 9, fontWeight: "700", color: "#6B7280", letterSpacing: 0.8, marginBottom: 6 },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#F9FAFB",
  },
  selectorDisabled: { backgroundColor: "#F3F4F6", opacity: 0.6 },
  selectorText: { fontSize: 13, color: "#374151", flex: 1 },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#F9FAFB",
  },
  dateBtnText: { flex: 1, fontSize: 13, color: "#374151" },
  calendarioContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  buscarBtnGrandeWrap: {
    borderRadius: 12,
    marginTop: 4,
    overflow: "hidden",
  },
  buscarBtnGrande: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    height: 48,
  },
  buscarBtnGrandeTexto: { color: "#fff", fontSize: 14, fontWeight: "700" },
  modalOverlayInterno: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalInternoContenedor: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: "70%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  puntoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  puntoItemActivo: { backgroundColor: "#EEF2FF" },
  puntoText: { flex: 1, fontSize: 13.5, color: "#374151" },
  puntoTextActivo: { color: "#2f4ea2", fontWeight: "700" },
});