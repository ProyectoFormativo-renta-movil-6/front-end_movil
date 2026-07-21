// modules/reserva/components/ResumenReservaModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { useReservaStore } from "@/store/reservaStore";
import { GRADIENTES } from "@/constants/gradients";
import {
  COLOR_MARCA, COLORES,
  METODOS_PAGO, PORCENTAJE_CARGOS_ADMINISTRATIVOS, PORCENTAJE_IVA,
  RECARGO_LOGISTICO, formatHoraAmPm,
} from "../constants/reserva.constants";
import { CIUDADES_DATA, getCiudadPorSucursal, getDireccionSucursal } from "@/modules/catalogo/constants/catalogo.constants";
import CalendarioRango from "./CalendarioRango";
import SelectorSucursalModal, { OpcionLugar } from "./SelectorSucursalModal";
import SelectorHoraModal from "./SelectorHoraModal";
import { AlertaPagoEfectivo } from "./AlertaPagoEfectivo";
import {
  fmt, fmtPct, fechaHora, diasEntre,
  SubcardHeader, SubcardHeaderEditando, FilaDato, OpcionCard, ServicioRow, LineaPrecio, FilaBotonesEdicion,
  styles as piezas,
} from "./ResumenReservaModal.piezas";
import { useMonedaStore } from "@/store/monedaStore";

interface Props {
  visible: boolean;
  vehiculo: Vehiculo;
  onCerrar: () => void;
  mostrarPlanes?: boolean;
  // Fechas, lugar y método de pago del tab 1 ya completos. Mientras
  // sea false, el modal no muestra ninguna tarjeta editable — solo
  // un mensaje pidiendo terminar ese tab primero.
  seccionFechasCompleta?: boolean;
}

// Las 3 tarjetas del resumen comparten un solo patrón: modo "resumen"
// (solo lectura + botón Editar) o su modo "editarX" correspondiente
// (campos editables + Volver/Actualizar). Nunca sales del modal.
type Modo = "resumen" | "editarPago" | "editarFechas" | "editarPlanes";

export default function ResumenReservaModal({
  visible,
  vehiculo,
  onCerrar,
  mostrarPlanes = false,
  seccionFechasCompleta = false,
}: Props) {
  const insets = useSafeAreaInsets();
  // Nos suscribimos al store de moneda para re-renderizar el desglose de
  // precios cuando cambie COP↔USD o llegue una tasa nueva.
  useMonedaStore();
  const fechasLugar = useReservaStore((s) => s.fechasLugar);
  const actualizarFechasLugar = useReservaStore((s) => s.actualizarFechasLugar);
  const planes = useReservaStore((s) => s.planes);
  const actualizarPlanes = useReservaStore((s) => s.actualizarPlanes);

  const [modo, setModo] = useState<Modo>("resumen");
  const [modalLugar, setModalLugar] = useState<"retiro" | "devolucion" | null>(null);
  const [horaVisible, setHoraVisible] = useState<"retiro" | "devolucion" | null>(null);
  const [alertaEfectivoVisible, setAlertaEfectivoVisible] = useState(false);
  const [draftPago, setDraftPago] = useState(fechasLugar);
  const [draftFechas, setDraftFechas] = useState(fechasLugar);
  const [draftPlanes, setDraftPlanes] = useState(planes);

  const nombreSucursal = vehiculo.sucursal ?? "";
  const ciudadInfo = nombreSucursal
    ? CIUDADES_DATA.find((c) => c.nombre === getCiudadPorSucursal(nombreSucursal))
    : null;

  const construirOpciones = (prefijo: string, esWompi: boolean): OpcionLugar[] => {
    const base: OpcionLugar[] = [{ value: nombreSucursal, label: `${prefijo} en sucursal (${nombreSucursal})`, icono: "business-outline" }];
    if (!esWompi) return base;
    const otro = prefijo === "Recoger" ? "Entrega" : "Devolución";
    base.push({ value: "domicilio", label: `${otro} a domicilio`, icono: "home-outline" });
    if (ciudadInfo?.tieneAeropuerto) base.push({ value: "aeropuerto", label: `${otro} en aeropuerto`, icono: "airplane-outline" });
    if (ciudadInfo?.tieneTerminal) base.push({ value: "terminal", label: `${otro} en terminal`, icono: "bus-outline" });
    return base;
  };

  const opcionesEntrega = (esWompi: boolean) => construirOpciones("Recoger", esWompi);
  const opcionesDevolucion = (esWompi: boolean) => construirOpciones("Devolver", esWompi);
  const labelLugar = (opciones: OpcionLugar[], value: string) => opciones.find((o) => o.value === value)?.label || value || "Seleccionar";

  useEffect(() => {
    if (draftPago.metodoPago !== "wompi") {
      setDraftPago((p) => ({ ...p, lugarRetiro: nombreSucursal, lugarDevolucion: nombreSucursal }));
    }
  }, [draftPago.metodoPago, nombreSucursal]);

  const fechasCompletas = !!fechasLugar.fechaRetiro && !!fechasLugar.fechaDevolucion;
  const metodoPagoActual = METODOS_PAGO.find((m) => m.id === fechasLugar.metodoPago);

  const seguros = vehiculo.seguros ?? [];
  const kmLimitado = vehiculo.tarifas?.kmLimitado;
  const kmIlimitado = vehiculo.tarifas?.kmIlimitado;
  const servicios = vehiculo.servicios ?? [];

  const seguroElegido = useMemo(() => seguros.find((s) => s.nombre === planes.proteccion) ?? null, [seguros, planes.proteccion]);
  const kmElegido = planes.tipoKilometraje === "limitado" ? kmLimitado : planes.tipoKilometraje === "ilimitado" ? kmIlimitado : null;
  const labelKm = planes.tipoKilometraje === "limitado" ? "Limitado" : planes.tipoKilometraje === "ilimitado" ? "Ilimitado" : "Sin elegir";
  const serviciosTexto = planes.serviciosSeleccionados.length > 0 ? planes.serviciosSeleccionados.join(", ") : "Ninguno";

  const desglose = useMemo(() => {
    const dias = diasEntre(fechasLugar.fechaRetiro, fechasLugar.fechaDevolucion);
    const diarias = vehiculo.precio * dias;
    const proteccion = mostrarPlanes && seguroElegido ? seguroElegido.precio * dias : 0;
    const kilometraje = mostrarPlanes && kmElegido ? kmElegido.precio * dias : 0;
    const servAdic = mostrarPlanes
      ? servicios.filter((s) => planes.serviciosSeleccionados.includes(s.nombre)).reduce((a, s) => a + s.precio * dias, 0)
      : 0;
    const cargos = Math.round(diarias * PORCENTAJE_CARGOS_ADMINISTRATIVOS);
    const subtotal = diarias + proteccion + kilometraje + servAdic + cargos + RECARGO_LOGISTICO;
    const iva = Math.round(subtotal * PORCENTAJE_IVA);
    return { dias, diarias, proteccion, kilometraje, servAdic, cargos, subtotal, iva, total: subtotal + iva };
  }, [vehiculo.precio, fechasLugar.fechaRetiro, fechasLugar.fechaDevolucion, mostrarPlanes, seguroElegido, kmElegido, servicios, planes.serviciosSeleccionados]);

  const cerrar = () => { setModo("resumen"); onCerrar(); };
  const confirmarPago = () => { actualizarFechasLugar(draftPago); setModo("resumen"); };
  const confirmarFechas = () => { actualizarFechasLugar(draftFechas); setModo("resumen"); };
  const confirmarPlanes = () => { actualizarPlanes(draftPlanes); setModo("resumen"); };

  const titulos: Record<Modo, string> = {
    resumen: "Resumen de tu reserva",
    editarPago: "Pago y lugar",
    editarFechas: "Fechas y horas",
    editarPlanes: "Planes y servicios",
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={cerrar} presentationStyle="pageSheet">
      <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>{titulos[modo]}</Text>
          <TouchableOpacity onPress={cerrar} hitSlop={10}>
            <Ionicons name="close" size={22} color={COLORES.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.cardMaestra}>
            <LinearGradient
              colors={GRADIENTES.panel.colors}
              start={GRADIENTES.panel.start}
              end={GRADIENTES.panel.end}
              style={styles.vehiculoBanner}
            >
              <Text style={styles.vehiculoBannerLabel}>GRUPO</Text>
              <Text style={styles.vehiculoBannerNombre}>{vehiculo.nombre}</Text>
              <Text style={styles.vehiculoBannerSub}>{vehiculo.categoria ?? "Económico"} — {vehiculo.transmision}</Text>
            </LinearGradient>

            {!seccionFechasCompleta ? (
              // Aún no se ha completado fechas + lugar + método de pago
              // en el primer paso — no hay nada que resumir todavía.
              <View style={piezas.subcard}>
                <View style={piezas.rowGap}>
                  <Ionicons name="information-circle-outline" size={14} color={COLOR_MARCA} />
                  <Text style={piezas.subcardTitulo}>Resumen no disponible aún</Text>
                </View>
                <Text style={[piezas.bloqueSub, { marginTop: 8 }]}>
                  Completa las fechas, el lugar y el método de pago en el primer paso para ver aquí el
                  resumen de tu reserva.
                </Text>
              </View>
            ) : (
              <>
                {/* PAGO Y LUGAR */}
                {modo === "resumen" || modo === "editarPago" ? (
                  <View style={piezas.subcard}>
                    {modo !== "editarPago" ? (
                      <>
                        <SubcardHeader icono="card-outline" titulo="Pago y lugar" onEditar={() => { setDraftPago(fechasLugar); setModo("editarPago"); }} />
                        <FilaDato icono="card-outline" label="Método de pago" valor={metodoPagoActual?.titulo ?? "Sin elegir"} />
                        <FilaDato icono="location-outline" label="Lugar de retiro" valor={labelLugar(opcionesEntrega(fechasLugar.metodoPago === "wompi"), fechasLugar.lugarRetiro)} />
                        <FilaDato icono="location-outline" label="Lugar de devolución" valor={labelLugar(opcionesDevolucion(fechasLugar.metodoPago === "wompi"), fechasLugar.lugarDevolucion)} ultima />
                      </>
                    ) : (
                      <View>
                        <SubcardHeaderEditando icono="card-outline" titulo="Pago y lugar" />
                        <Text style={[piezas.label, { marginTop: 12 }]}>¿CÓMO PAGAS?</Text>
                        <View style={piezas.filaDosCols}>
                          {METODOS_PAGO.map((m) => (
                            <TouchableOpacity key={m.id} style={[piezas.metodoCard, draftPago.metodoPago === m.id && piezas.metodoCardActivo]} onPress={() => { setDraftPago((p) => ({ ...p, metodoPago: m.id })); if (m.id === "efectivo") setAlertaEfectivoVisible(true); }}>
                              <Text style={piezas.metodoTitulo}>{m.titulo}</Text>
                              <Text style={piezas.metodoDesc}>{m.descripcion}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        <Text style={piezas.label}>¿DÓNDE LO RECOGES Y DEVUELVES?</Text>
                        <View style={piezas.filaDosCols}>
                          <TouchableOpacity style={piezas.selectBox} onPress={() => setModalLugar("retiro")}>
                            <Text style={piezas.selectLabel}>RECOGES</Text>
                            <Text style={piezas.selectValue} numberOfLines={1}>{labelLugar(opcionesEntrega(draftPago.metodoPago === "wompi"), draftPago.lugarRetiro)}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={piezas.selectBox} onPress={() => setModalLugar("devolucion")}>
                            <Text style={piezas.selectLabel}>DEVUELVES</Text>
                            <Text style={piezas.selectValue} numberOfLines={1}>{labelLugar(opcionesDevolucion(draftPago.metodoPago === "wompi"), draftPago.lugarDevolucion)}</Text>
                          </TouchableOpacity>
                        </View>

                        <FilaBotonesEdicion onVolver={() => setModo("resumen")} onActualizar={confirmarPago} />
                      </View>
                    )}
                  </View>
                ) : null}

                {/* FECHAS Y HORAS */}
                {modo === "resumen" || modo === "editarFechas" ? (
                  <View style={piezas.subcard}>
                    {modo !== "editarFechas" ? (
                      <>
                        <SubcardHeader icono="calendar-outline" titulo="Fechas y horas" onEditar={() => { setDraftFechas(fechasLugar); setModo("editarFechas"); }} />
                        <FilaDato icono="log-out-outline" label="Retiras" valor={fechaHora(fechasLugar.fechaRetiro, fechasLugar.horaRetiro, formatHoraAmPm)} />
                        <FilaDato icono="log-in-outline" label="Devuelves" valor={fechaHora(fechasLugar.fechaDevolucion, fechasLugar.horaDevolucion, formatHoraAmPm)} ultima />
                      </>
                    ) : (
                      <View>
                        <SubcardHeaderEditando icono="calendar-outline" titulo="Fechas y horas" />
                        <Text style={[piezas.label, { marginTop: 12 }]}>¿A QUÉ HORA?</Text>
                        <View style={piezas.filaDosCols}>
                          <TouchableOpacity style={piezas.selectBox} onPress={() => setHoraVisible("retiro")}>
                            <Text style={piezas.selectLabel}>RETIRAS</Text>
                            <Text style={piezas.selectValue}>{draftFechas.horaRetiro ? formatHoraAmPm(draftFechas.horaRetiro) : "Seleccionar"}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={piezas.selectBox} onPress={() => setHoraVisible("devolucion")}>
                            <Text style={piezas.selectLabel}>DEVUELVES</Text>
                            <Text style={piezas.selectValue}>{draftFechas.horaDevolucion ? formatHoraAmPm(draftFechas.horaDevolucion) : "Seleccionar"}</Text>
                          </TouchableOpacity>
                        </View>

                        <Text style={piezas.label}>¿QUÉ DÍAS?</Text>
                        <CalendarioRango
                          vehiculo={vehiculo}
                          fechaRetiro={draftFechas.fechaRetiro}
                          fechaDevolucion={draftFechas.fechaDevolucion}
                          onCambiarFechas={(retiro, devolucion) => setDraftFechas((f) => ({ ...f, fechaRetiro: retiro, fechaDevolucion: devolucion }))}
                        />

                        <FilaBotonesEdicion onVolver={() => setModo("resumen")} onActualizar={confirmarFechas} />
                      </View>
                    )}
                  </View>
                ) : null}

                {/* PLANES Y SERVICIOS */}
                {mostrarPlanes && (modo === "resumen" || modo === "editarPlanes") ? (
                  <View style={piezas.subcard}>
                    {modo !== "editarPlanes" ? (
                      <>
                        <SubcardHeader icono="shield-checkmark-outline" titulo="Planes y servicios" onEditar={() => { setDraftPlanes(planes); setModo("editarPlanes"); }} />
                        <FilaDato icono="shield-checkmark-outline" label="Protección" valor={planes.proteccion || "Sin elegir"} />
                        <FilaDato icono="speedometer-outline" label="Kilometraje" valor={labelKm} />
                        <FilaDato icono="add-circle-outline" label="Servicios adicionales" valor={serviciosTexto} ultima />
                      </>
                    ) : (
                      <View>
                        <SubcardHeaderEditando icono="shield-checkmark-outline" titulo="Planes y servicios" />

                        {seguros.length > 0 && (
                          <>
                            <Text style={[piezas.label, { marginTop: 12 }]}>PROTECCIÓN</Text>
                            {seguros.map((s) => (
                              <OpcionCard key={s.nombre} titulo={s.nombre} desc={`${fmt(s.precio)} / día`} activo={draftPlanes.proteccion === s.nombre} onPress={() => setDraftPlanes((p) => ({ ...p, proteccion: s.nombre }))} />
                            ))}
                          </>
                        )}

                        {(kmLimitado || kmIlimitado) && (
                          <>
                            <Text style={piezas.label}>TIPO DE KILOMETRAJE</Text>
                            {kmLimitado && (
                              <OpcionCard titulo="Kilómetro limitado" desc={`Incluye ${kmLimitado.km} km por día · ${fmt(kmLimitado.precio)} / día`} activo={draftPlanes.tipoKilometraje === "limitado"} onPress={() => setDraftPlanes((p) => ({ ...p, tipoKilometraje: "limitado" }))} />
                            )}
                            {kmIlimitado && (
                              <OpcionCard titulo="Kilómetro ilimitado" desc={`Sin restricción de distancia · ${fmt(kmIlimitado.precio)} / día`} activo={draftPlanes.tipoKilometraje === "ilimitado"} onPress={() => setDraftPlanes((p) => ({ ...p, tipoKilometraje: "ilimitado" }))} />
                            )}
                          </>
                        )}

                        {servicios.length > 0 && (
                          <>
                            <Text style={piezas.label}>SERVICIOS ADICIONALES</Text>
                            {servicios.map((s) => {
                              const activo = draftPlanes.serviciosSeleccionados.includes(s.nombre);
                              return (
                                <ServicioRow
                                  key={s.nombre}
                                  nombre={s.nombre}
                                  precio={s.precio}
                                  activo={activo}
                                  onPress={() =>
                                    setDraftPlanes((p) => ({
                                      ...p,
                                      serviciosSeleccionados: activo
                                        ? p.serviciosSeleccionados.filter((n) => n !== s.nombre)
                                        : [...p.serviciosSeleccionados, s.nombre],
                                    }))
                                  }
                                />
                              );
                            })}
                          </>
                        )}

                        <FilaBotonesEdicion onVolver={() => setModo("resumen")} onActualizar={confirmarPlanes} />
                      </View>
                    )}
                  </View>
                ) : null}

                {/* DESGLOSE — formato tipo "oferta", completo */}
                {modo === "resumen" && (
                  <View style={piezas.subcard}>
                    {fechasCompletas ? (
                      <>
                        <View style={piezas.rowGap}>
                          <Ionicons name="receipt-outline" size={14} color={COLOR_MARCA} />
                          <Text style={piezas.subcardTitulo}>Oferta {vehiculo.categoria ?? "Estándar"}</Text>
                        </View>

                        <View style={piezas.desgloseCabecera}>
                          <Text style={piezas.desgloseCabeceraLabel}></Text>
                          <Text style={piezas.desgloseCabeceraTotal}>Total</Text>
                        </View>

                        <Text style={piezas.desgloseSeccionTitulo}>Diarias</Text>
                        <LineaPrecio
                          label={`${desglose.dias} día${desglose.dias > 1 ? "s" : ""} × ${fmt(vehiculo.precio)}`}
                          valor={fmt(desglose.diarias)}
                          destacado
                        />

                        {desglose.proteccion > 0 && (
                          <>
                            <Text style={piezas.desgloseSeccionTitulo}>Protecciones</Text>
                            <Text style={piezas.desgloseSubtexto}>{planes.proteccion}</Text>
                            <LineaPrecio
                              label={`${desglose.dias} día${desglose.dias > 1 ? "s" : ""} × ${fmt(seguroElegido?.precio ?? 0)}`}
                              valor={fmt(desglose.proteccion)}
                              destacado
                            />
                          </>
                        )}

                        {desglose.kilometraje > 0 && (
                          <>
                            <Text style={piezas.desgloseSeccionTitulo}>Kilometraje — {labelKm}</Text>
                            <LineaPrecio
                              label={`${desglose.dias} día${desglose.dias > 1 ? "s" : ""} × ${fmt(kmElegido?.precio ?? 0)}`}
                              valor={fmt(desglose.kilometraje)}
                              destacado
                            />
                          </>
                        )}

                        {desglose.servAdic > 0 && (
                          <>
                            <Text style={piezas.desgloseSeccionTitulo}>Servicios adicionales</Text>
                            <LineaPrecio label={serviciosTexto} valor={fmt(desglose.servAdic)} destacado />
                          </>
                        )}

                        <View style={piezas.desgloseDivisor} />

                        <LineaPrecio label={`Cargos Administrativos (${fmtPct(PORCENTAJE_CARGOS_ADMINISTRATIVOS)})`} valor={fmt(desglose.cargos)} />
                        <LineaPrecio label="Subtotal Reserva" valor={fmt(desglose.subtotal - desglose.iva)} destacado />
                        <LineaPrecio label="Recargo Logístico" valor={fmt(RECARGO_LOGISTICO)} />
                        <LineaPrecio label={`IVA (${fmtPct(PORCENTAJE_IVA)})`} valor={fmt(desglose.iva)} />
                      </>
                    ) : (
                      <Text style={piezas.bloqueSub}>Selecciona las fechas de retiro y devolución para ver el precio estimado.</Text>
                    )}
                  </View>
                )}

                {modo === "resumen" && fechasCompletas && (
                  <View style={piezas.totalBlock}>
                    <Text style={piezas.totalLabelChica}>TOTAL FINAL</Text>
                    <Text style={piezas.totalValorGrande}>{fmt(desglose.total)}</Text>
                    <Text style={piezas.totalNota}>*Valor total incluye impuestos</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>

        {modo === "resumen" && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <TouchableOpacity style={styles.cerrarBtnWrap} onPress={cerrar} activeOpacity={0.85}>
              <LinearGradient
                colors={GRADIENTES.boton.colors}
                start={GRADIENTES.boton.start}
                end={GRADIENTES.boton.end}
                style={styles.cerrarBtn}
              >
                <Text style={styles.cerrarBtnText}>Cerrar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <SelectorSucursalModal
          visible={modalLugar !== null}
          titulo={modalLugar === "retiro" ? "Lugar de retiro" : "Lugar de devolución"}
          opciones={modalLugar === "retiro" ? opcionesEntrega(draftPago.metodoPago === "wompi") : opcionesDevolucion(draftPago.metodoPago === "wompi")}
          onSeleccionar={(v) => { setDraftPago((p) => ({ ...p, [modalLugar === "retiro" ? "lugarRetiro" : "lugarDevolucion"]: v })); setModalLugar(null); }}
          onCerrar={() => setModalLugar(null)}
        />

        <SelectorHoraModal
          visible={horaVisible !== null}
          horaSeleccionada={horaVisible === "retiro" ? draftFechas.horaRetiro : draftFechas.horaDevolucion}
          onSeleccionar={(h) => setDraftFechas((f) => ({ ...f, [horaVisible === "retiro" ? "horaRetiro" : "horaDevolucion"]: h }))}
          onCerrar={() => setHoraVisible(null)}
        />

        <AlertaPagoEfectivo
          visible={alertaEfectivoVisible}
          nombreSucursal={nombreSucursal}
          ciudad={ciudadInfo?.nombre ?? getCiudadPorSucursal(nombreSucursal)}
          direccion={getDireccionSucursal(nombreSucursal)}
          onCerrar={() => setAlertaEfectivoVisible(false)}
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

  cardMaestra: { backgroundColor: COLORES.panelBg, borderRadius: 16, borderWidth: 1, borderColor: COLORES.panelBorderStrong, overflow: "hidden", marginBottom: 8 },
  vehiculoBanner: { padding: 14 },
  vehiculoBannerLabel: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.75)", letterSpacing: 0.4 },
  vehiculoBannerNombre: { fontSize: 16, fontWeight: "800", color: "#fff", marginTop: 4 },
  vehiculoBannerSub: { fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.85)", marginTop: 4 },

  footer: { borderTopWidth: 1, borderTopColor: COLORES.panelBorder, paddingHorizontal: 16, paddingTop: 12 },
  cerrarBtnWrap: { borderRadius: 12 },
  cerrarBtn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  cerrarBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});