// modules/reserva/components/TarjetaVerificacionDocumental.tsx
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import { useTranslation } from "react-i18next";
import { COLOR_MARCA, TAMANO_MAXIMO_ARCHIVO_BYTES } from "../constants/reserva.constants";
import { useReservaStore } from "@/store/reservaStore";
import CampoSubidaDocumento from "./CampoSubidaDocumento";

export default function TarjetaVerificacionDocumental() {
  const documentos = useReservaStore((s) => s.documentos);
  const actualizarDocumento = useReservaStore((s) => s.actualizarDocumento);
  const c = useTemaColores();
  const { t } = useTranslation();

  const [errorCedula, setErrorCedula] = useState("");
  const [errorLicencia, setErrorLicencia] = useState("");
  const [cargandoCedula, setCargandoCedula] = useState(false);
  const [cargandoLicencia, setCargandoLicencia] = useState(false);

  const primaryAccent = c.oscuro ? "#60A5FA" : COLOR_MARCA;

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
      setError(t("reserva.documentos.archivoDemasiadoGrande"));
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
      <Text style={[styles.seccionLabel, { color: c.textMuted }]}>{t("reserva.documentos.seccionLabel")}</Text>

      <View style={[styles.card, { backgroundColor: c.bgCard }]}>
        {/* Cédula arriba, licencia abajo — apiladas, no lado a lado */}
        <View style={styles.columnaSubtarjetas}>
          <CampoSubidaDocumento
            etiqueta={t("reserva.documentos.cedulaEtiqueta")}
            ayuda={t("reserva.documentos.cedulaAyuda")}
            archivo={documentos.cedulaFrente}
            cargando={cargandoCedula}
            error={errorCedula}
            onSeleccionar={() => seleccionarArchivo("cedulaFrente", setCargandoCedula, setErrorCedula)}
            onQuitar={() => actualizarDocumento("cedulaFrente", null)}
          />
          <CampoSubidaDocumento
            etiqueta={t("reserva.documentos.licenciaEtiqueta")}
            ayuda={t("reserva.documentos.licenciaAyuda")}
            archivo={documentos.licenciaConduccion}
            cargando={cargandoLicencia}
            error={errorLicencia}
            onSeleccionar={() => seleccionarArchivo("licenciaConduccion", setCargandoLicencia, setErrorLicencia)}
            onQuitar={() => actualizarDocumento("licenciaConduccion", null)}
          />
        </View>

        {/* Nota: dentro de la tarjeta, pero FUERA de las subtarjetas */}
        <View style={[styles.nota, { backgroundColor: c.primaryBg, borderColor: c.border }]}>
          <Ionicons name="information-circle-outline" size={18} color={primaryAccent} style={styles.notaIcono} />
          <Text style={[styles.notaTexto, { color: c.textSecondary }]}>
            {t("reserva.documentos.nota")}
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
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
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
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  notaIcono: { marginTop: 1 },
  notaTexto: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
  },
});