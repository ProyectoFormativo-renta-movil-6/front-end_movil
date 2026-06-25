import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar, // <-- IMPORTACIÓN AGREGADA AQUÍ PARA QUITAR EL ROJO
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SUCURSALES } from "../constants/catalogo.constants";
import { BusquedaForm } from "../types/catalogo.types";

const PUNTOS = SUCURSALES.filter((s) => s !== "Todas las sucursales");

type PickerField = "recogida" | "devolucion" | null;
type DateField = "fechaInicio" | "fechaFin" | null;

function formatFechaDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

interface Props {
  form: BusquedaForm;
  setForm: (campo: keyof BusquedaForm, valor: string | boolean) => void;
  onBuscar: () => void;
  textBusqueda: string;
  setTextBusqueda: (texto: string) => void; // Para buscar por marca/modelo
  errorBusqueda?: string;
  disabled?: boolean;
  modalFormVisible: boolean;
  setModalFormVisible: (visible: boolean) => void;
}

export default function BuscadorCatalogo({
  form,
  setForm,
  onBuscar,
  textBusqueda,
  setTextBusqueda,
  errorBusqueda,
  disabled = false,
  modalFormVisible,
  setModalFormVisible,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState<PickerField>(null);
  const [datePickerField, setDatePickerField] = useState<DateField>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const currentSelected =
    pickerOpen === "recogida" ? form.lugarRecogida : form.lugarDevolucion;
  const tieneBusquedaActiva = !!(
    form.lugarRecogida ||
    form.lugarDevolucion ||
    form.fechaInicio ||
    form.fechaFin
  );

  const limpiarFormulario = () => {
    setForm("lugarRecogida", "");
    setForm("lugarDevolucion", "");
    setForm("fechaInicio", "");
    setForm("fechaFin", "");
  };

  const selectPunto = (punto: string) => {
    if (pickerOpen === "recogida") setForm("lugarRecogida", punto);
    else setForm("lugarDevolucion", punto);
    setPickerOpen(null);
  };

  const openDatePicker = (field: DateField) => {
    if (disabled) return;
    const existing = field === "fechaInicio" ? form.fechaInicio : form.fechaFin;
    setTempDate(existing ? new Date(existing) : new Date());
    setDatePickerField(field);
  };

  const onDateChange = (_: any, selected?: Date) => {
    if (Platform.OS === "android") setDatePickerField(null);
    if (selected && datePickerField) {
      const iso = selected.toISOString().split("T")[0];
      setForm(datePickerField, iso);
    }
  };

  return (
    <View style={styles.containerGeneral}>
      {/* BARRA DE BÚSQUEDA REAL */}
      <View style={[styles.barraInput, disabled && styles.barraDisabled]}>
        <Ionicons
          name={disabled ? "lock-closed-outline" : "search-outline"}
          size={18}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder={
            disabled ? "Inicia sesión para buscar..." : "Buscar vehículo..."
          }
          placeholderTextColor="#9CA3AF"
          value={textBusqueda}
          onChangeText={setTextBusqueda}
          editable={!disabled}
        />
      </View>

      {/* MODAL DE DISPONIBILIDAD DE FECHAS Y LUGARES */}
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
            <Text style={styles.modalFormTitle}>Buscar Disponibilidad</Text>
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
                <Text style={styles.label}>RECOGIDA</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setPickerOpen("recogida")}
                >
                  <Ionicons name="location-outline" size={14} color="#2f4ea2" />
                  <Text
                    style={[
                      styles.selectorText,
                      !form.lugarRecogida && styles.placeholder,
                    ]}
                    numberOfLines={1}
                  >
                    {form.lugarRecogida || "Selecciona punto"}
                  </Text>
                  <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>DEVOLUCIÓN</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setPickerOpen("devolucion")}
                >
                  <Ionicons name="location-outline" size={14} color="#2f4ea2" />
                  <Text
                    style={[
                      styles.selectorText,
                      !form.lugarDevolucion && styles.placeholder,
                    ]}
                    numberOfLines={1}
                  >
                    {form.lugarDevolucion || "Selecciona punto"}
                  </Text>
                  <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>FECHA RECOGIDA</Text>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => openDatePicker("fechaInicio")}
                >
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
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>FECHA DEVOLUCIÓN</Text>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => openDatePicker("fechaFin")}
                >
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
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón de envío */}
            <TouchableOpacity
              style={styles.buscarBtnGrande}
              onPress={() => {
                setModalFormVisible(false);
                onBuscar();
              }}
            >
              <Ionicons name="search" size={18} color="#fff" />
              <Text style={styles.buscarBtnGrandeTexto}>
                Buscar disponibilidad
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Picker de locaciones interno */}
        <Modal visible={!!pickerOpen} animationType="fade" transparent>
          <View style={styles.modalOverlayInterno}>
            <View style={styles.modalInternoContenedor}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {pickerOpen === "recogida"
                    ? "Lugar de recogida"
                    : "Lugar de devolución"}
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setPickerOpen(null)}
                >
                  <Ionicons name="close" size={20} color="#374151" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={PUNTOS}
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
                      name="location-outline"
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

        {/* Android DatePicker */}
        {Platform.OS === "android" && !!datePickerField && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={onDateChange}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerGeneral: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  barraDisabled: {
    backgroundColor: "#F3F4F6",
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    height: "100%",
  },
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
  txtLimpiarModal: { fontSize: 14, color: "#DC2626", fontWeight: "600" },
  modalFormBody: { padding: 20, gap: 16 },
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1 },
  label: {
    fontSize: 9,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
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
  buscarBtnGrande: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2f4ea2",
    borderRadius: 12,
    height: 48,
    marginTop: 10,
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
