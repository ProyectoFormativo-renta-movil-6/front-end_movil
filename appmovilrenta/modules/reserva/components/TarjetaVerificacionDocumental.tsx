// modules/reserva/components/TarjetaVerificacionDocumental.tsx
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { COLOR_MARCA, COLORES, TAMANO_MAXIMO_ARCHIVO_BYTES } from "../constants/reserva.constants";
import { useReservaStore } from "@/store/reservaStore";
import CampoSubidaDocumento from "./CampoSubidaDocumento";

export default function TarjetaVerificacionDocumental() {
  const documentos = useReservaStore((s) => s.documentos);
  const actualizarDocumento = useReservaStore((s) => s.actualizarDocumento);

  const [errorCedula, setErrorCedula] = useState("");
  const [errorLicencia, setErrorLicencia] = useState("");
  const [cargandoCedula, setCargandoCedula] = useState(false);
  const [cargandoLicencia, setCargandoLicencia] = useState(false);

  const seleccionarArchivo = async (
    llave: "cedulaFrente" | "licenciaConduccion",
    setCargando: (v: boolean) => void,
    setError: (v: string) => void
  ) => {
    setError("");
    const resultado = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (resultado.canceled) return;

    const archivo = resultado.assets[0];
    if (archivo.size && archivo.size > TAMANO_MAXIMO_ARCHIVO_BYTES) {
      setError("El archivo supera el peso máximo de 5MB.");
      return;
    }

    setCargando(true);
    // Simula el tiempo de "subida" — cuando exista backend real, aquí va el upload.
    setTimeout(() => {
      actualizarDocumento(llave, {
        uri: archivo.uri,
        nombre: archivo.name,
        tamanoBytes: archivo.size ?? 0,
        tipoMime: archivo.mimeType ?? "application/pdf",
      });
      setCargando(false);
    }, 800);
  };

  return (
    <View>
      {/* Título fuera de la tarjeta, mismo patrón que "Datos personales" */}
      <Text style={styles.seccionLabel}>Verificación Documental Obligatoria</Text>

      <View style={styles.card}>
        {/* Cédula arriba, licencia abajo — apiladas, no lado a lado */}
        <View style={styles.columnaSubtarjetas}>
          <CampoSubidaDocumento
            etiqueta="Cédula de Ciudadanía"
            ayuda="Sube tu documento de identidad en un solo archivo PDF (ambos lados incluidos, máx 5MB)"
            archivo={documentos.cedulaFrente}
            cargando={cargandoCedula}
            error={errorCedula}
            onSeleccionar={() => seleccionarArchivo("cedulaFrente", setCargandoCedula, setErrorCedula)}
            onQuitar={() => actualizarDocumento("cedulaFrente", null)}
          />
          <CampoSubidaDocumento
            etiqueta="Licencia de Conducción"
            ayuda="Sube tu licencia de conducción vigente y legible en formato PDF (máx 5MB)"
            archivo={documentos.licenciaConduccion}
            cargando={cargandoLicencia}
            error={errorLicencia}
            onSeleccionar={() => seleccionarArchivo("licenciaConduccion", setCargandoLicencia, setErrorLicencia)}
            onQuitar={() => actualizarDocumento("licenciaConduccion", null)}
          />
        </View>

        {/* Nota: dentro de la tarjeta, pero FUERA de las subtarjetas */}
        <View style={styles.nota}>
          <Ionicons name="information-circle-outline" size={18} color={COLOR_MARCA} style={styles.notaIcono} />
          <Text style={styles.notaTexto}>
            La verificación de tus documentos será realizada de forma manual por el personal de la sucursal al
            momento de la entrega del carro. Asegúrate de que las fotos/escaneos dentro del PDF sean nítidos.
          </Text>
        </View>
      </View>
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
  card: {
    backgroundColor: COLORES.panelBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  // Antes "filaSubtarjetas" con flexDirection: row — ahora en columna,
  // cédula arriba y licencia abajo
  columnaSubtarjetas: {
    gap: 12,
    marginBottom: 14,
  },
  filaSubtarjetas: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  subtarjetaFlex: { flex: 1 },
  nota: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#eef2fb",
    borderWidth: 1,
    borderColor: "#c7d5f5",
    borderRadius: 12,
    padding: 12,
  },
  notaIcono: { marginTop: 1 },
  notaTexto: {
    flex: 1,
    fontSize: 11.5,
    color: COLORES.textSecondary,
    lineHeight: 16,
  },
});