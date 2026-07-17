import React, { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { MetodoPago } from "@/modules/reserva/types/reserva.types";
import { useReservaStore } from "@/store/reservaStore";
import {
  COLOR_MARCA,
  COLORES,
  METODOS_PAGO,
  PORCENTAJE_CARGOS_ADMINISTRATIVOS,
  PORCENTAJE_IVA,
  RECARGO_LOGISTICO,
  formatHoraAmPm,
} from "../constants/reserva.constants";
import { CIUDADES_DATA, getCiudadPorSucursal } from "@/modules/catalogo/constants/catalogo.constants";
import CalendarioRango from "./CalendarioRango";
import SelectorSucursalModal, { OpcionLugar } from "./SelectorSucursalModal";
import SelectorHoraModal from "./SelectorHoraModal";

interface Props {
  visible: boolean;
  vehiculo: Vehiculo;
  onCerrar: () => void;
  onEditarFechas?: () => void;
  onEditarVehiculo?: () => void;
}

type Modo = "resumen" | "editarPago" | "editarFechas";

interface DraftPago {
  metodoPago: MetodoPago | null;
  lugarRetiro: string;
  lugarDevolucion: string;
}

interface DraftFechas {
  fechaRetiro: string | null;
  fechaDevolucion: string | null;
  horaRetiro: string;
  horaDevolucion: string;
}

function formatPorcentaje(valor: number): string {
  return `${Math.round(valor * 100)}%`;
}

function formatPrecio(precio: number): string {
  return `$${Math.round(precio).toLocaleString("es-CO")}`;
}

function formatFechaCorta(fecha: string | null): string {
  if (!fecha) return "";
  const d = new Date(fecha + "T00:00:00");
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

// NUEVO: combina fecha + hora en un solo texto, para la fila unificada
// "Retiras" / "Devuelves" (ej: "15 jul · 10:00 a.m.")
function formatFechaHora(fecha: string | null, hora: string): string {
  const f = fecha ? formatFechaCorta(fecha) : "";
  const h = hora ? formatHoraAmPm(hora) : "";
  if (f && h) return `${f} · ${h}`;
  return f || h || "Seleccionar";
}

function diasEntre(inicio: string | null, fin: string | null): number {
  if (!inicio || !fin) return 0;
  const a = new Date(inicio + "T00:00:00");
  const b = new Date(fin + "T00:00:00");
  return Math.max(Math.round((b.getTime() - a.getTime()) / 86400000), 1);
}

// ===================== COMPONENTES UNIFICADOS =====================
// Mismo encabezado para TODAS las subtarjetas: ícono + título en
// mayúsculas a la izquierda, botón "Editar" (con lápiz) a la derecha.
function SubcardHeader({
  icono,
  titulo,
  onEditar,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  onEditar: () => void;
}) {
  return (
    <View style={styles.subcardHeader}>
      <View style={styles.subcardHeaderIzq}>
        <Ionicons name={icono} size={14} color={COLOR_MARCA} />
        <Text style={styles.subcardTitulo}>{titulo}</Text>
      </View>
      <TouchableOpacity style={styles.editarBtn} onPress={onEditar} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="pencil" size={11} color={COLOR_MARCA} />
        <Text style={styles.editarLink}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Misma fila para TODOS los datos: ícono + etiqueta chica arriba +
// valor en negrita abajo. Usada tanto en "Pago y lugar" como en
// "Fechas y horas".
function FilaDato({
  icono,
  label,
  valor,
  ultima,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  label: string;
  valor: string;
  ultima?: boolean;
}) {
  return (
    <>
      <View style={styles.filaDato}>
        <Ionicons name={icono} size={15} color={COLORES.textMuted} style={styles.filaDatoIcono} />
        <View style={styles.filaDatoTexto}>
          <Text style={styles.filaDatoLabel}>{label}</Text>
          <Text style={styles.filaDatoValor} numberOfLines={1}>{valor}</Text>
        </View>
      </View>
      {!ultima && <View style={styles.filaDatoDivisor} />}
    </>
  );
}

export default function ResumenReservaModal({ visible, vehiculo, onCerrar }: Props) {
  const insets = useSafeAreaInsets();
  const fechasLugar = useReservaStore((s) => s.fechasLugar);
  const actualizarFechasLugar = useReservaStore((s) => s.actualizarFechasLugar);

  const [modo, setModo] = useState<Modo>("resumen");
  const [modalTipoLugar, setModalTipoLugar] = useState<"retiro" | "devolucion" | null>(null);
  const [horaVisible, setHoraVisible] = useState<"retiro" | "devolucion" | null>(null);

  const [draftPago, setDraftPago] = useState<DraftPago>({
    metodoPago: fechasLugar.metodoPago,
    lugarRetiro: fechasLugar.lugarRetiro,
    lugarDevolucion: fechasLugar.lugarDevolucion,
  });
  const [draftFechas, setDraftFechas] = useState<DraftFechas>({
    fechaRetiro: fechasLugar.fechaRetiro,
    fechaDevolucion: fechasLugar.fechaDevolucion,
    horaRetiro: fechasLugar.horaRetiro,
    horaDevolucion: fechasLugar.horaDevolucion,
  });

  const nombreSucursal = vehiculo.sucursal ?? "";
  const ciudadNombre = vehiculo.sucursal ? getCiudadPorSucursal(vehiculo.sucursal) : null;
  const ciudadInfo = ciudadNombre ? CIUDADES_DATA.find((c) => c.nombre === ciudadNombre) : null;

  const esWompiResumen = fechasLugar.metodoPago === "wompi";
  const esWompiDraft = draftPago.metodoPago === "wompi";

  function construirOpciones(prefijo: string, esWompi: boolean): OpcionLugar[] {
    const base: OpcionLugar[] = [
      { value: nombreSucursal, label: `${prefijo} en sucursal (${nombreSucursal})`, icono: "business-outline" },
    ];
    if (esWompi) {
      base.push({ value: "domicilio", label: `${prefijo === "Recoger" ? "Entrega" : "Devolución"} a domicilio`, icono: "home-outline" });
      if (ciudadInfo?.tieneAeropuerto) base.push({ value: "aeropuerto", label: `${prefijo === "Recoger" ? "Entrega" : "Devolución"} en aeropuerto`, icono: "airplane-outline" });
      if (ciudadInfo?.tieneTerminal) base.push({ value: "terminal", label: `${prefijo === "Recoger" ? "Entrega" : "Devolución"} en terminal`, icono: "bus-outline" });
    }
    return base;
  }

  const opcionesEntregaResumen = useMemo(() => construirOpciones("Recoger", esWompiResumen), [nombreSucursal, esWompiResumen, ciudadInfo]);
  const opcionesDevolucionResumen = useMemo(() => construirOpciones("Devolver", esWompiResumen), [nombreSucursal, esWompiResumen, ciudadInfo]);
  const opcionesEntregaDraft = useMemo(() => construirOpciones("Recoger", esWompiDraft), [nombreSucursal, esWompiDraft, ciudadInfo]);
  const opcionesDevolucionDraft = useMemo(() => construirOpciones("Devolver", esWompiDraft), [nombreSucursal, esWompiDraft, ciudadInfo]);

  useEffect(() => {
    if (!esWompiDraft) {
      setDraftPago((prev) => ({
        ...prev,
        lugarRetiro: prev.lugarRetiro === nombreSucursal ? prev.lugarRetiro : nombreSucursal,
        lugarDevolucion: prev.lugarDevolucion === nombreSucursal ? prev.lugarDevolucion : nombreSucursal,
      }));
    }
  }, [esWompiDraft, nombreSucursal]);

  const labelLugarResumen = (opciones: OpcionLugar[], value: string) =>
    opciones.find((o) => o.value === value)?.label || value || "Seleccionar";

  const metodoPagoActual = METODOS_PAGO.find((m) => m.id === fechasLugar.metodoPago);
  const fechasCompletas = !!fechasLugar.fechaRetiro && !!fechasLugar.fechaDevolucion;

  const colMetodoPago = metodoPagoActual ? metodoPagoActual.titulo : "Sin elegir";
  const colLugarRetiro = fechasLugar.lugarRetiro
    ? labelLugarResumen(opcionesEntregaResumen, fechasLugar.lugarRetiro)
    : "Seleccionar";
  const colLugarDevolucion = fechasLugar.lugarDevolucion
    ? labelLugarResumen(opcionesDevolucionResumen, fechasLugar.lugarDevolucion)
    : "Seleccionar";

  // Fecha + hora combinadas en un solo valor por dirección (mismo patrón
  // de fila que "Pago y lugar")
  const colRetiro = formatFechaHora(fechasLugar.fechaRetiro, fechasLugar.horaRetiro);
  const colDevolucion = formatFechaHora(fechasLugar.fechaDevolucion, fechasLugar.horaDevolucion);

  const desglose = useMemo(() => {
    const dias = diasEntre(fechasLugar.fechaRetiro, fechasLugar.fechaDevolucion);
    const diarias = vehiculo.precio * dias;
    const cargos = Math.round(diarias * PORCENTAJE_CARGOS_ADMINISTRATIVOS);
    const recargoLogistico = RECARGO_LOGISTICO;
    const subtotal = diarias + cargos + recargoLogistico;
    const iva = Math.round(subtotal * PORCENTAJE_IVA);
    const total = subtotal + iva;
    return { dias, diarias, cargos, recargoLogistico, subtotal, iva, total };
  }, [vehiculo.precio, fechasLugar.fechaRetiro, fechasLugar.fechaDevolucion]);

  const abrirEditarPago = () => {
    setDraftPago({
      metodoPago: fechasLugar.metodoPago,
      lugarRetiro: fechasLugar.lugarRetiro,
      lugarDevolucion: fechasLugar.lugarDevolucion,
    });
    setModo("editarPago");
  };

  const abrirEditarFechas = () => {
    setDraftFechas({
      fechaRetiro: fechasLugar.fechaRetiro,
      fechaDevolucion: fechasLugar.fechaDevolucion,
      horaRetiro: fechasLugar.horaRetiro,
      horaDevolucion: fechasLugar.horaDevolucion,
    });
    setModo("editarFechas");
  };

  const volverAResumen = () => setModo("resumen");

  const confirmarPago = () => {
    actualizarFechasLugar({
      metodoPago: draftPago.metodoPago,
      lugarRetiro: draftPago.lugarRetiro,
      lugarDevolucion: draftPago.lugarDevolucion,
    });
    setModo("resumen");
  };

  const confirmarFechas = () => {
    actualizarFechasLugar({
      fechaRetiro: draftFechas.fechaRetiro,
      fechaDevolucion: draftFechas.fechaDevolucion,
      horaRetiro: draftFechas.horaRetiro,
      horaDevolucion: draftFechas.horaDevolucion,
    });
    setModo("resumen");
  };

  const handleElegirSucursal = (value: string) => {
    if (modalTipoLugar === "retiro") setDraftPago((p) => ({ ...p, lugarRetiro: value }));
    if (modalTipoLugar === "devolucion") setDraftPago((p) => ({ ...p, lugarDevolucion: value }));
    setModalTipoLugar(null);
  };

  const handleElegirHora = (hora: string) => {
    if (horaVisible === "retiro") setDraftFechas((f) => ({ ...f, horaRetiro: hora }));
    else if (horaVisible === "devolucion") setDraftFechas((f) => ({ ...f, horaDevolucion: hora }));
  };

  const cerrarYResetear = () => {
    setModo("resumen");
    onCerrar();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={cerrarYResetear} presentationStyle="pageSheet">
      <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>
            {modo === "resumen" ? "Resumen de tu reserva" : modo === "editarPago" ? "Pago y lugar" : "Fechas y horas"}
          </Text>
          <TouchableOpacity onPress={cerrarYResetear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={22} color={COLORES.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.cardMaestra}>
            {/* --- VEHÍCULO: informativo, sin Editar --- */}
            <View style={styles.vehiculoBanner}>
              <Text style={styles.vehiculoBannerLabel}>VEHÍCULO</Text>
              <Text style={styles.vehiculoBannerNombre}>{vehiculo.nombre}</Text>
              <Text style={styles.vehiculoBannerSub}>{vehiculo.categoria ?? "Económico"} — {vehiculo.transmision}</Text>
            </View>

            {/* --- SUBTARJETA 1: PAGO Y LUGAR --- */}
            {modo !== "editarFechas" && (
              <View style={styles.subcard}>
                {modo !== "editarPago" ? (
                  <>
                    <SubcardHeader icono="card-outline" titulo="Pago y lugar" onEditar={abrirEditarPago} />
                    <FilaDato icono="card-outline" label="Método de pago" valor={colMetodoPago} />
                    <FilaDato icono="location-outline" label="Lugar de retiro" valor={colLugarRetiro} />
                    <FilaDato icono="location-outline" label="Lugar de devolución" valor={colLugarDevolucion} ultima />
                  </>
                ) : (
                  <View style={styles.bloqueEdicion}>
                    <Text style={styles.label}>¿CÓMO PAGAS?</Text>
                    <View style={styles.filaDosCols}>
                      {METODOS_PAGO.map((metodo) => {
                        const activo = draftPago.metodoPago === metodo.id;
                        return (
                          <TouchableOpacity
                            key={metodo.id}
                            style={[styles.metodoCard, activo && styles.metodoCardActivo]}
                            onPress={() => setDraftPago((p) => ({ ...p, metodoPago: metodo.id }))}
                            activeOpacity={0.8}
                          >
                            <View style={styles.metodoHeaderRow}>
                              <Text style={[styles.metodoTitulo, activo && styles.metodoTituloActivo]}>{metodo.titulo}</Text>
                              <View style={[styles.radio, activo && styles.radioActivo]}>
                                {activo && <View style={styles.radioPunto} />}
                              </View>
                            </View>
                            <Text style={[styles.metodoDesc, activo && styles.metodoDescActivo]}>{metodo.descripcion}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <Text style={styles.label}>¿DÓNDE LO RECOGES Y DEVUELVES?</Text>
                    <View style={styles.filaDosCols}>
                      <TouchableOpacity style={styles.selectBox} onPress={() => setModalTipoLugar("retiro")}>
                        <View style={styles.selectLabelRow}>
                          <Ionicons name="location-outline" size={12} color={COLORES.textMuted} />
                          <Text style={styles.selectLabel}>RECOGES</Text>
                        </View>
                        <Text style={styles.selectValue} numberOfLines={1}>
                          {labelLugarResumen(opcionesEntregaDraft, draftPago.lugarRetiro)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.selectBox} onPress={() => setModalTipoLugar("devolucion")}>
                        <View style={styles.selectLabelRow}>
                          <Ionicons name="location-outline" size={12} color={COLORES.textMuted} />
                          <Text style={styles.selectLabel}>DEVUELVES</Text>
                        </View>
                        <Text style={styles.selectValue} numberOfLines={1}>
                          {labelLugarResumen(opcionesDevolucionDraft, draftPago.lugarDevolucion)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.filaBotonesEdicion}>
                      <TouchableOpacity style={styles.volverBtn} onPress={volverAResumen}>
                        <Text style={styles.volverBtnText}>Volver</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actualizarBtn} onPress={confirmarPago}>
                        <Text style={styles.actualizarBtnText}>Actualizar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* --- SUBTARJETA 2: FECHAS Y HORAS --- */}
            {modo !== "editarPago" && (
              <View style={styles.subcard}>
                {modo !== "editarFechas" ? (
                  <>
                    <SubcardHeader icono="calendar-outline" titulo="Fechas y horas" onEditar={abrirEditarFechas} />
                    <FilaDato icono="log-out-outline" label="Retiras" valor={colRetiro} />
                    <FilaDato icono="log-in-outline" label="Devuelves" valor={colDevolucion} ultima />
                  </>
                ) : (
                  <View style={styles.bloqueEdicion}>
                    <Text style={styles.label}>¿A QUÉ HORA?</Text>
                    <View style={styles.filaDosCols}>
                      <TouchableOpacity style={styles.selectBox} onPress={() => setHoraVisible("retiro")}>
                        <View style={styles.selectLabelRow}>
                          <Ionicons name="time-outline" size={12} color={COLORES.textMuted} />
                          <Text style={styles.selectLabel}>RETIRAS</Text>
                        </View>
                        <View style={styles.selectValorRow}>
                          <Text style={styles.selectValue}>
                            {draftFechas.horaRetiro ? formatHoraAmPm(draftFechas.horaRetiro) : "Seleccionar"}
                          </Text>
                          <Ionicons name="chevron-down" size={14} color={COLORES.textMuted} />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.selectBox} onPress={() => setHoraVisible("devolucion")}>
                        <View style={styles.selectLabelRow}>
                          <Ionicons name="time-outline" size={12} color={COLORES.textMuted} />
                          <Text style={styles.selectLabel}>DEVUELVES</Text>
                        </View>
                        <View style={styles.selectValorRow}>
                          <Text style={styles.selectValue}>
                            {draftFechas.horaDevolucion ? formatHoraAmPm(draftFechas.horaDevolucion) : "Seleccionar"}
                          </Text>
                          <Ionicons name="chevron-down" size={14} color={COLORES.textMuted} />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.labelConIcono}>
                      <Ionicons name="calendar-outline" size={13} color={COLORES.textMuted} />
                      <Text style={styles.label}>¿QUÉ DÍAS?</Text>
                    </View>
                    <CalendarioRango
                      vehiculo={vehiculo}
                      fechaRetiro={draftFechas.fechaRetiro}
                      fechaDevolucion={draftFechas.fechaDevolucion}
                      onCambiarFechas={(retiro, devolucion) =>
                        setDraftFechas((f) => ({ ...f, fechaRetiro: retiro, fechaDevolucion: devolucion }))
                      }
                    />

                    <View style={styles.filaBotonesEdicion}>
                      <TouchableOpacity style={styles.volverBtn} onPress={volverAResumen}>
                        <Text style={styles.volverBtnText}>Volver</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actualizarBtn} onPress={confirmarFechas}>
                        <Text style={styles.actualizarBtnText}>Actualizar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* --- SUBTARJETA 3: DESGLOSE DE PRECIO --- */}
            {modo === "resumen" && (
              <View style={styles.subcard}>
                {fechasCompletas ? (
                  <>
                    <View style={styles.subcardHeaderIzq}>
                      <Ionicons name="receipt-outline" size={14} color={COLOR_MARCA} />
                      <Text style={styles.subcardTitulo}>Desglose</Text>
                    </View>

                    <View style={[styles.lineaPrecio, { marginTop: 12 }]}>
                      <Text style={styles.lineaLabel}>Diarias ({desglose.dias} día{desglose.dias > 1 ? "s" : ""})</Text>
                      <Text style={styles.lineaValor}>{formatPrecio(desglose.diarias)}</Text>
                    </View>
                    <View style={styles.lineaPrecio}>
                      <Text style={styles.lineaLabel}>
                        Cargos administrativos ({formatPorcentaje(PORCENTAJE_CARGOS_ADMINISTRATIVOS)})
                      </Text>
                      <Text style={styles.lineaValor}>{formatPrecio(desglose.cargos)}</Text>
                    </View>
                    <View style={styles.lineaPrecio}>
                      <Text style={styles.lineaLabel}>Recargo logístico</Text>
                      <Text style={styles.lineaValor}>{formatPrecio(desglose.recargoLogistico)}</Text>
                    </View>

                    <View style={styles.subtotalBox}>
                      <Text style={styles.subtotalLabel}>Subtotal estimado</Text>
                      <Text style={styles.subtotalValor}>{formatPrecio(desglose.subtotal)}</Text>
                    </View>

                    <View style={[styles.lineaPrecio, { marginTop: 12 }]}>
                      <Text style={styles.lineaLabel}>IVA ({formatPorcentaje(PORCENTAJE_IVA)})</Text>
                      <Text style={styles.lineaValor}>{formatPrecio(desglose.iva)}</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.bloqueSub}>Selecciona las fechas de retiro y devolución para ver el precio estimado.</Text>
                )}
              </View>
            )}

            {/* --- TOTAL A PAGAR --- */}
            {modo === "resumen" && fechasCompletas && (
              <View style={styles.totalBlock}>
                <View style={styles.totalFilaSuperior}>
                  <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
                  <Text style={styles.totalValor}>{formatPrecio(desglose.total)}</Text>
                </View>
                <Text style={styles.totalNota}>Incluye IVA. No incluye protección, la eliges en el siguiente paso</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {modo === "resumen" && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <TouchableOpacity style={styles.cerrarBtn} onPress={cerrarYResetear}>
              <Text style={styles.cerrarBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}

        <SelectorSucursalModal
          visible={modalTipoLugar !== null}
          titulo={modalTipoLugar === "retiro" ? "Lugar de retiro" : "Lugar de devolución"}
          opciones={modalTipoLugar === "retiro" ? opcionesEntregaDraft : opcionesDevolucionDraft}
          onSeleccionar={handleElegirSucursal}
          onCerrar={() => setModalTipoLugar(null)}
        />

        <SelectorHoraModal
          visible={horaVisible !== null}
          horaSeleccionada={horaVisible === "retiro" ? draftFechas.horaRetiro : draftFechas.horaDevolucion}
          onSeleccionar={handleElegirHora}
          onCerrar={() => setHoraVisible(null)}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.pageBg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14 },
  headerTitulo: { fontSize: 16, fontWeight: "800", color: COLORES.textPrimary },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

  cardMaestra: {
    backgroundColor: COLORES.panelBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    overflow: "hidden",
    marginBottom: 8,
  },

  vehiculoBanner: { backgroundColor: COLOR_MARCA, padding: 14 },
  vehiculoBannerLabel: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.75)", letterSpacing: 0.4 },
  vehiculoBannerNombre: { fontSize: 16, fontWeight: "800", color: "#fff", marginTop: 4 },
  vehiculoBannerSub: { fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.85)", marginTop: 4 },

  subcard: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORES.panelBorder,
  },

  // Encabezado unificado de subtarjeta
  subcardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  subcardHeaderIzq: { flexDirection: "row", alignItems: "center", gap: 6 },
  subcardTitulo: { fontSize: 11, fontWeight: "700", color: COLORES.textMuted, letterSpacing: 0.3, textTransform: "uppercase" },
  editarBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#eef2fb", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  editarLink: { fontSize: 11, fontWeight: "700", color: COLOR_MARCA },

  // Fila de dato unificada: ícono + label arriba + valor abajo
  filaDato: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 10 },
  filaDatoIcono: { width: 16 },
  filaDatoTexto: { flex: 1 },
  filaDatoLabel: { fontSize: 10, fontWeight: "700", color: COLORES.textMuted, letterSpacing: 0.2, marginBottom: 3 },
  filaDatoValor: { fontSize: 14, fontWeight: "700", color: COLORES.textPrimary },
  filaDatoDivisor: { height: 1, backgroundColor: COLORES.panelBorder, marginLeft: 26 },

  bloqueSub: { fontSize: 11, color: COLORES.textMuted },

  bloqueEdicion: {},
  filaBotonesEdicion: { flexDirection: "row", gap: 10, marginTop: 4 },

  lineaPrecio: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  lineaLabel: { fontSize: 12, color: COLORES.textSecondary },
  lineaValor: { fontSize: 12, fontWeight: "700", color: COLORES.textPrimary },

  subtotalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F1F5FB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  subtotalLabel: { fontSize: 12, fontWeight: "700", color: COLORES.textPrimary },
  subtotalValor: { fontSize: 13, fontWeight: "800", color: COLORES.textPrimary },

  totalBlock: {
    backgroundColor: "#eef2fb",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORES.panelBorder,
  },
  totalFilaSuperior: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 12, fontWeight: "700", color: COLORES.textMuted },
  totalValor: { fontSize: 20, fontWeight: "800", color: "#1e3a8a" },
  totalNota: { fontSize: 10, color: COLORES.textMuted, marginTop: 8 },

  footer: { borderTopWidth: 1, borderTopColor: COLORES.panelBorder, paddingHorizontal: 16, paddingTop: 12 },
  cerrarBtn: { backgroundColor: COLOR_MARCA, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  cerrarBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  volverBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORES.panelBorderStrong, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  volverBtnText: { fontSize: 13, fontWeight: "800", color: COLORES.textSecondary },
  actualizarBtn: { flex: 1, backgroundColor: COLOR_MARCA, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  actualizarBtnText: { fontSize: 13, fontWeight: "800", color: "#fff" },

  label: { fontSize: 10, fontWeight: "700", color: COLORES.textMuted, letterSpacing: 0.3, marginBottom: 8, marginTop: 4 },
  labelConIcono: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4, marginBottom: 8 },
  filaDosCols: { flexDirection: "row", gap: 8, marginBottom: 14 },
  metodoCard: { flex: 1, borderWidth: 1, borderColor: COLORES.panelBorderStrong, borderRadius: 10, padding: 10 },
  metodoCardActivo: { borderColor: COLOR_MARCA, borderWidth: 1.5, backgroundColor: "#eef2fb" },
  metodoHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  metodoTitulo: { fontSize: 11, fontWeight: "700", color: COLORES.textSecondary, flex: 1, marginRight: 6 },
  metodoTituloActivo: { color: "#0c447c" },
  metodoDesc: { fontSize: 9, color: COLORES.textMuted, marginTop: 4 },
  metodoDescActivo: { color: "#185fa5" },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: COLORES.panelBorderStrong, alignItems: "center", justifyContent: "center" },
  radioActivo: { borderColor: COLOR_MARCA },
  radioPunto: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLOR_MARCA },
  selectBox: { flex: 1, borderWidth: 1, borderColor: COLORES.panelBorderStrong, borderRadius: 10, padding: 9 },
  selectLabelRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
  selectLabel: { fontSize: 9, color: COLORES.textMuted, fontWeight: "700" },
  selectValue: { fontSize: 11, fontWeight: "600", color: COLORES.textPrimary },
  selectValorRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});