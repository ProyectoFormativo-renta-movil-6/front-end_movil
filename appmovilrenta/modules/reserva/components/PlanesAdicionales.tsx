import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { useReservaStore } from "@/store/reservaStore";
import {
  BENEFICIOS_PROTECCION,
  BENEFICIOS_KILOMETRAJE,
  COLOR_MARCA,
  COLORES,
  ICONOS_SERVICIOS,
  ICONO_SERVICIO_DEFECTO,
  INFO_KILOMETRAJE_COLOMBIA,
} from "../constants/reserva.constants";
import { AlertModal } from "../../../components/ui/AlertModal";

interface Props {
  vehiculo: Vehiculo;
  onContinuar?: () => void;
}

// Servicios adicionales fijos que aplican a cualquier vehículo,
// independientemente de lo que traiga vehiculo.servicios. Todos
// opcionales. Los íconos NO van aquí: salen de ICONOS_SERVICIOS en
// reserva.constants.ts según el nombre.
// TODO: reemplazar estos precios de ejemplo por las tarifas reales
// definidas por el negocio (valor por día, en pesos).
const SERVICIOS_FIJOS = [
  { nombre: "Lavado si el vehículo llega sucio", precio: 15000 }, // TODO
  { nombre: "Entrega con tanque lleno", precio: 20000 }, // TODO
  { nombre: "Silla para bebé", precio: 12000 }, // TODO
  { nombre: "Conductor adicional", precio: 25000 }, // TODO
  { nombre: "GPS / Sistema de navegación", precio: 10000 }, // TODO
  { nombre: "Entrega en otra ciudad", precio: 50000 }, // TODO
  { nombre: "WiFi portátil", precio: 18000 }, // TODO
];

function formatPrecio(precio: number): string {
  return `$${Math.round(precio).toLocaleString("es-CO")}`;
}

function calcularDias(fechaRetiro: string | null, fechaDevolucion: string | null): number {
  if (!fechaRetiro || !fechaDevolucion) return 1;
  const inicio = new Date(fechaRetiro);
  const fin = new Date(fechaDevolucion);
  const diffMs = fin.getTime() - inicio.getTime();
  const dias = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return dias > 0 ? dias : 1;
}

function IconoBeneficio({ tipo }: { tipo: "check" | "warning" | "cross" }) {
  if (tipo === "check") return <Ionicons name="checkmark-circle" size={13} color={COLOR_MARCA} />;
  if (tipo === "warning") return <Ionicons name="alert-circle" size={13} color={COLORES.textSecondary} />;
  return <Ionicons name="close-circle-outline" size={13} color={COLORES.textMuted} />;
}

// Lista de beneficios reutilizable — mismo bloque visual usado en
// Protección, Kilometraje limitado y Kilometraje ilimitado.
function ListaBeneficios({ beneficios }: { beneficios: { tipo: "check" | "warning" | "cross"; texto: string }[] }) {
  if (beneficios.length === 0) return null;
  return (
    <View style={styles.beneficiosLista}>
      {beneficios.map((b, i) => (
        <View key={i} style={styles.beneficioFila}>
          <IconoBeneficio tipo={b.tipo} />
          <Text style={[styles.beneficioTexto, b.tipo === "cross" && styles.beneficioTextoTachado]}>
            {b.texto}
          </Text>
        </View>
      ))}
    </View>
  );
}

// Footer de total al final de cada tarjeta (Protección / Kilometraje /
// Servicios). Mismo bloque visual en las tres, solo cambia el label.
function FooterTotalTarjeta({ label, valor }: { label: string; valor: number }) {
  return (
    <View style={styles.footerTotalTarjeta}>
      <Text style={styles.footerTotalLabel}>{label}</Text>
      <Text style={styles.footerTotalValor}>{formatPrecio(valor)}</Text>
    </View>
  );
}

export default function PlanesAdicionales({ vehiculo, onContinuar }: Props) {
  const planes = useReservaStore((s) => s.planes);
  const fechasLugar = useReservaStore((s) => s.fechasLugar);
  const actualizarPlanes = useReservaStore((s) => s.actualizarPlanes);
  const toggleServicioAdicional = useReservaStore((s) => s.toggleServicioAdicional);

  const [alertaFaltantesVisible, setAlertaFaltantesVisible] = useState(false);

  const servicios = vehiculo.servicios ?? [];
  const todosLosServicios = useMemo(() => [...servicios, ...SERVICIOS_FIJOS], [servicios]);
  const kmLimitado = vehiculo.tarifas?.kmLimitado;
  const kmIlimitado = vehiculo.tarifas?.kmIlimitado;
  const seguros = vehiculo.seguros ?? [];

  const dias = useMemo(
    () => calcularDias(fechasLugar.fechaRetiro, fechasLugar.fechaDevolucion),
    [fechasLugar.fechaRetiro, fechasLugar.fechaDevolucion]
  );

  // --- Totales por sección (para footers de cada tarjeta y para el
  // resumen final). Todos en función de los "días" del alquiler. ---

  const seguroElegido = useMemo(
    () => seguros.find((s) => s.nombre === planes.proteccion) ?? null,
    [seguros, planes.proteccion]
  );
  const totalProteccion = seguroElegido ? seguroElegido.precio * dias : 0;

  const kmElegido = useMemo(() => {
    if (planes.tipoKilometraje === "limitado") return kmLimitado ?? null;
    if (planes.tipoKilometraje === "ilimitado") return kmIlimitado ?? null;
    return null;
  }, [planes.tipoKilometraje, kmLimitado, kmIlimitado]);
  const totalKilometraje = kmElegido ? kmElegido.precio * dias : 0;

  const totalServicios = useMemo(() => {
    return todosLosServicios
      .filter((s) => planes.serviciosSeleccionados.includes(s.nombre))
      .reduce((acc, s) => acc + s.precio * dias, 0);
  }, [todosLosServicios, planes.serviciosSeleccionados, dias]);

  // Suma de las tres secciones de este tab — no incluye la tarifa base
  // del vehículo ni cargos administrativos/IVA, eso vive en el
  // desglose del ResumenReservaModal.
  const totalPlanes = totalProteccion + totalKilometraje + totalServicios;

  const puedeContinuar = !!planes.proteccion && !!planes.tipoKilometraje;

  const handleIrADatos = () => {
    if (!puedeContinuar) {
      setAlertaFaltantesVisible(true);
      return;
    }
    onContinuar?.();
  };

  return (
    <View>
      {/* --- PROTECCIÓN --- */}
      {seguros.length > 0 && (
        <>
          <Text style={styles.seccionLabel}>Elige tu protección</Text>
          <View style={styles.card}>
            {seguros.map((seguro) => {
              const activo = planes.proteccion === seguro.nombre;
              const beneficios = BENEFICIOS_PROTECCION[seguro.nombre] ?? [];

              return (
                <TouchableOpacity
                  key={seguro.nombre}
                  style={[styles.opcionCard, activo && styles.opcionCardActiva]}
                  onPress={() => actualizarPlanes({ proteccion: seguro.nombre })}
                  activeOpacity={0.8}
                >
                  <View style={styles.opcionHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.opcionTitulo, activo && styles.opcionTituloActiva]}>
                        {seguro.nombre}
                      </Text>
                      <Text style={[styles.opcionDesc, activo && styles.opcionDescActiva]}>
                        {formatPrecio(seguro.precio)} / día · {formatPrecio(seguro.precio * dias)} en {dias}{" "}
                        {dias === 1 ? "día" : "días"}
                      </Text>
                    </View>
                    <View style={[styles.radio, activo && styles.radioActivo]}>
                      {activo && <View style={styles.radioPunto} />}
                    </View>
                  </View>

                  <ListaBeneficios beneficios={beneficios} />
                </TouchableOpacity>
              );
            })}

            {seguroElegido && (
              <FooterTotalTarjeta label="Total protección" valor={totalProteccion} />
            )}
          </View>
        </>
      )}

      {/* --- TIPO DE KILÓMETROS --- */}
      {(kmLimitado || kmIlimitado) && (
        <>
          <Text style={[styles.seccionLabel, { marginTop: 20 }]}>Tipo de kilómetraje</Text>
          <Text style={styles.infoGeneral}>{INFO_KILOMETRAJE_COLOMBIA}</Text>
          <View style={styles.card}>
            {kmLimitado && (
              <TouchableOpacity
                style={[styles.opcionCard, planes.tipoKilometraje === "limitado" && styles.opcionCardActiva]}
                onPress={() => actualizarPlanes({ tipoKilometraje: "limitado" })}
                activeOpacity={0.8}
              >
                <View style={styles.opcionHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.opcionTitulo,
                        planes.tipoKilometraje === "limitado" && styles.opcionTituloActiva,
                      ]}
                    >
                      Kilómetro limitado
                    </Text>
                    <Text
                      style={[
                        styles.opcionDesc,
                        planes.tipoKilometraje === "limitado" && styles.opcionDescActiva,
                      ]}
                    >
                      Incluye {kmLimitado.km} km por día · {formatPrecio(kmLimitado.precio)} / día
                      {kmLimitado.excedente ? ` · excedente ${formatPrecio(kmLimitado.excedente)}/km` : ""}
                    </Text>
                  </View>
                  <View style={[styles.radio, planes.tipoKilometraje === "limitado" && styles.radioActivo]}>
                    {planes.tipoKilometraje === "limitado" && <View style={styles.radioPunto} />}
                  </View>
                </View>

                <ListaBeneficios beneficios={BENEFICIOS_KILOMETRAJE.limitado} />
              </TouchableOpacity>
            )}

            {kmIlimitado && (
              <TouchableOpacity
                style={[styles.opcionCard, planes.tipoKilometraje === "ilimitado" && styles.opcionCardActiva]}
                onPress={() => actualizarPlanes({ tipoKilometraje: "ilimitado" })}
                activeOpacity={0.8}
              >
                <View style={styles.opcionHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.opcionTitulo,
                        planes.tipoKilometraje === "ilimitado" && styles.opcionTituloActiva,
                      ]}
                    >
                      Kilómetro ilimitado
                    </Text>
                    <Text
                      style={[
                        styles.opcionDesc,
                        planes.tipoKilometraje === "ilimitado" && styles.opcionDescActiva,
                      ]}
                    >
                      Sin restricción de distancia · {formatPrecio(kmIlimitado.precio)} / día
                    </Text>
                  </View>
                  <View style={[styles.radio, planes.tipoKilometraje === "ilimitado" && styles.radioActivo]}>
                    {planes.tipoKilometraje === "ilimitado" && <View style={styles.radioPunto} />}
                  </View>
                </View>

                <ListaBeneficios beneficios={BENEFICIOS_KILOMETRAJE.ilimitado} />
              </TouchableOpacity>
            )}

            {kmElegido && (
              <FooterTotalTarjeta label="Total kilometraje" valor={totalKilometraje} />
            )}
          </View>
        </>
      )}

      {/* --- SERVICIOS ADICIONALES (opcionales) --- */}
      <Text style={[styles.seccionLabel, { marginTop: 20 }]}>Servicios adicionales</Text>
      <View style={styles.card}>
        <Text style={styles.serviciosSub}>Elige uno, varios o ninguno.</Text>

        {todosLosServicios.map((servicio) => {
          const seleccionado = planes.serviciosSeleccionados.includes(servicio.nombre);
          const icono = ICONOS_SERVICIOS[servicio.nombre] ?? ICONO_SERVICIO_DEFECTO;

          return (
            <TouchableOpacity
              key={servicio.nombre}
              style={[styles.servicioCard, seleccionado && styles.opcionCardActiva]}
              onPress={() => toggleServicioAdicional(servicio.nombre)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={seleccionado ? "checkbox" : "square-outline"}
                size={18}
                color={seleccionado ? COLOR_MARCA : COLORES.textMuted}
              />
              <Ionicons
                name={icono as any}
                size={14}
                color={seleccionado ? COLOR_MARCA : COLORES.textMuted}
                style={{ marginLeft: 8, marginRight: 8 }}
              />
              <Text style={[styles.servicioNombre, seleccionado && styles.opcionTituloActiva]} numberOfLines={2}>
                {servicio.nombre}
              </Text>
              {servicio.precio > 0 && (
                <Text style={styles.servicioPrecio}>{formatPrecio(servicio.precio)}/día</Text>
              )}
            </TouchableOpacity>
          );
        })}

        {totalServicios > 0 && (
          <FooterTotalTarjeta label="Total servicios adicionales" valor={totalServicios} />
        )}
      </View>

      {/* --- RESUMEN DE PLANES: tarjeta final con el desglose de las
          tres secciones de este tab (protección + kilometraje +
          servicios). Solo se muestra si hay al menos algo elegido, para
          no aparecer vacía apenas se entra al tab. --- */}
      {totalPlanes > 0 && (
        <>
          <Text style={[styles.seccionLabel, { marginTop: 20 }]}>Resumen de planes</Text>
          <View style={styles.card}>
            <View style={styles.resumenSubcard}>
              {seguroElegido && (
                <View style={styles.lineaPrecio}>
                  <Text style={styles.lineaLabel}>Protección — {seguroElegido.nombre}</Text>
                  <Text style={styles.lineaValor}>{formatPrecio(totalProteccion)}</Text>
                </View>
              )}
              {kmElegido && (
                <View style={styles.lineaPrecio}>
                  <Text style={styles.lineaLabel}>
                    Kilometraje — {planes.tipoKilometraje === "limitado" ? "Limitado" : "Ilimitado"}
                  </Text>
                  <Text style={styles.lineaValor}>{formatPrecio(totalKilometraje)}</Text>
                </View>
              )}
              {totalServicios > 0 && (
                <View style={styles.lineaPrecio}>
                  <Text style={styles.lineaLabel}>Servicios adicionales</Text>
                  <Text style={styles.lineaValor}>{formatPrecio(totalServicios)}</Text>
                </View>
              )}

              <View style={styles.subtotalBox}>
                <Text style={styles.subtotalLabel}>Total planes ({dias} {dias === 1 ? "día" : "días"})</Text>
                <Text style={styles.subtotalValor}>{formatPrecio(totalPlanes)}</Text>
              </View>
            </View>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.confirmarBtn} onPress={handleIrADatos} activeOpacity={0.85}>
        <Text style={styles.confirmarBtnText}>Continuar</Text>
      </TouchableOpacity>

      <AlertModal
        visible={alertaFaltantesVisible}
        icono="alert-circle-outline"
        titulo="Faltan datos por completar"
        mensaje="Elige un plan de protección y un tipo de kilómetros para continuar."
        botones={[]}
        onCerrar={() => setAlertaFaltantesVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  seccionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORES.textMuted,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  infoGeneral: {
    fontSize: 10.5,
    color: COLORES.textMuted,
    lineHeight: 15,
    marginBottom: 10,
  },

  card: {
    backgroundColor: COLORES.panelBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  opcionCard: {
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  opcionCardActiva: {
    borderColor: COLOR_MARCA,
    borderWidth: 1.5,
    backgroundColor: "#eef2fb",
  },
  opcionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  opcionTitulo: { fontSize: 12.5, fontWeight: "700", color: COLORES.textSecondary },
  opcionTituloActiva: { color: "#0c447c" },
  opcionDesc: { fontSize: 10.5, color: COLORES.textMuted, marginTop: 4 },
  opcionDescActiva: { color: "#185fa5" },

  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORES.panelBorderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  radioActivo: { borderColor: COLOR_MARCA },
  radioPunto: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLOR_MARCA },

  beneficiosLista: { gap: 5, marginTop: 10 },
  beneficioFila: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  beneficioTexto: { flex: 1, fontSize: 10.5, color: COLORES.textSecondary, lineHeight: 15 },
  beneficioTextoTachado: { color: COLORES.textMuted, textDecorationLine: "line-through" },

  serviciosSub: { fontSize: 10, color: COLORES.textMuted, marginBottom: 8 },

  servicioCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORES.panelBorderStrong,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  servicioNombre: { flex: 1, fontSize: 11.5, fontWeight: "600", color: COLORES.textSecondary },
  servicioPrecio: { fontSize: 10.5, fontWeight: "700", color: COLORES.textMuted, marginLeft: 6 },

  // Footer de total al final de cada tarjeta (Protección / Kilometraje
  // / Servicios) — línea separada arriba, label + valor destacado.
  footerTotalTarjeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORES.panelBorderStrong,
  },
  footerTotalLabel: { fontSize: 12, fontWeight: "700", color: COLORES.textSecondary },
  footerTotalValor: { fontSize: 14.5, fontWeight: "800", color: COLOR_MARCA },

  // Subtarjeta de resumen final (mismo lenguaje visual del desglose
  // en ResumenReservaModal: lineaPrecio + subtotalBox).
  resumenSubcard: {},
  lineaPrecio: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  lineaLabel: { fontSize: 12, color: COLORES.textSecondary, flex: 1, marginRight: 8 },
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

  confirmarBtn: {
    alignSelf: "center",
    backgroundColor: COLOR_MARCA,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  confirmarBtnText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
});