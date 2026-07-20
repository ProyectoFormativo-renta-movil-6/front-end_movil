// modules/reserva/components/AlertaPagoEfectivo.tsx
//
// Alerta tipo "sweet alert" que se muestra cuando el usuario elige
// "Pago en efectivo" como método de pago. Al pagar en efectivo el
// único punto de retiro/devolución posible es la sucursal donde está
// el vehículo, así que le mostramos de una vez la ciudad y dirección
// exactas a las que debe dirigirse.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AlertModal } from "@/components/ui/AlertModal";

interface Props {
  visible: boolean;
  nombreSucursal: string;
  ciudad: string | null;
  direccion: string | null;
  onCerrar: () => void;
}

export function AlertaPagoEfectivo({ visible, nombreSucursal, ciudad, direccion, onCerrar }: Props) {
  return (
    <AlertModal
      visible={visible}
      icono="information-circle-outline"
      titulo="Pago en efectivo: retiro en sucursal"
      mensaje="Al pagar en efectivo, el único punto de retiro y devolución es la sucursal donde se encuentra el vehículo. Dirígete a:"
      onCerrar={onCerrar}
      botones={[{ texto: "Cerrar", onPress: onCerrar, variante: "primario" }]}
      contenido={
        <View style={s.caja}>
          <Text style={s.nombreSucursal}>{nombreSucursal}</Text>
          <Text style={s.fila}>
            <Text style={s.etiqueta}>Ciudad: </Text>
            {ciudad ?? "Sin definir"}
          </Text>
          <Text style={s.fila}>
            <Text style={s.etiqueta}>Dirección: </Text>
            {direccion ?? "Sin definir"}
          </Text>
        </View>
      }
    />
  );
}

const s = StyleSheet.create({
  caja: {
    width: "100%",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  nombreSucursal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 6,
  },
  fila: {
    fontSize: 13,
    color: "#1F2937",
    lineHeight: 19,
  },
  etiqueta: {
    fontWeight: "700",
    color: "#1F2937",
  },
});
