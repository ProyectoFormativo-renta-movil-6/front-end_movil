/**
 * RF50.2 — Modificar correo electrónico
 * RF50.4 — Validar contraseña actual
 * RF50.5 — Guardar cambios validados
 */
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTES } from "@/constants/gradients";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ErroresCambiarCorreo,
  FormCambiarCorreo,
} from "../types/perfil.types";

interface Props {
  visible: boolean;
  form: FormCambiarCorreo;
  errores: ErroresCambiarCorreo;
  cargando: boolean;
  correoActual: string;
  onCambiar: (campo: keyof FormCambiarCorreo, valor: string) => void;
  onGuardar: () => void;
  onCerrar: () => void;
}

export function ModalCambiarCorreo({
  visible,
  form,
  errores,
  cargando,
  correoActual,
  onCambiar,
  onGuardar,
  onCerrar,
}: Props) {
  const [verContrasena, setVerContrasena] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCerrar}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: Platform.OS === "android" ? 40 : 20,
            }}
          >
            {/* Encabezado */}
            <View style={styles.header}>
              <Text style={styles.titulo}>Cambiar correo</Text>
              <TouchableOpacity style={styles.btnCerrar} onPress={onCerrar}>
                <Text style={styles.btnCerrarText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Correo actual */}
            <View style={styles.correoActualWrap}>
              <Text style={styles.correoActualLabel}>Correo actual</Text>
              <Text style={styles.correoActualValor}>{correoActual}</Text>
            </View>

            {/* Nuevo correo */}
            <View style={styles.campoWrap}>
              <Text style={styles.campoLabel}>Nuevo correo *</Text>
              <TextInput
                style={[
                  styles.input,
                  errores.nuevoCorreo ? styles.inputError : null,
                ]}
                value={form.nuevoCorreo}
                onChangeText={(val) => onCambiar("nuevoCorreo", val)}
                placeholder="nuevo@correo.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errores.nuevoCorreo && (
                <Text style={styles.errorText}>{errores.nuevoCorreo}</Text>
              )}
            </View>

            {/* Confirmar correo */}
            <View style={styles.campoWrap}>
              <Text style={styles.campoLabel}>Confirmar nuevo correo *</Text>
              <TextInput
                style={[
                  styles.input,
                  errores.confirmarCorreo ? styles.inputError : null,
                ]}
                value={form.confirmarCorreo}
                onChangeText={(val) => onCambiar("confirmarCorreo", val)}
                placeholder="Repite el nuevo correo"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errores.confirmarCorreo && (
                <Text style={styles.errorText}>{errores.confirmarCorreo}</Text>
              )}
            </View>

            {/* Contraseña actual */}
            <View style={styles.campoWrap}>
              <Text style={styles.campoLabel}>Contraseña actual *</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[
                    styles.inputFlex,
                    errores.contrasenaActual ? styles.inputError : null,
                  ]}
                  value={form.contrasenaActual}
                  onChangeText={(val) => onCambiar("contrasenaActual", val)}
                  placeholder="Tu contraseña actual"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!verContrasena}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.btnVerContrasena}
                  onPress={() => setVerContrasena(!verContrasena)}
                >
                  <Text style={styles.btnVerContrasenaText}>
                    {verContrasena ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errores.contrasenaActual && (
                <Text style={styles.errorText}>{errores.contrasenaActual}</Text>
              )}
            </View>

            {/* Nota seguridad */}
            <View style={styles.notaWrap}>
              <Text style={styles.notaText}>
                🔐 Por tu seguridad verificamos tu contraseña antes de cambiar el correo.
              </Text>
            </View>

            {/* Botones */}
            <TouchableOpacity
              style={styles.btnGuardarWrap}
              onPress={onGuardar}
              activeOpacity={0.85}
              disabled={cargando}
            >
              {cargando ? (
                <View style={[styles.btnGuardar, styles.btnGuardarDisabled]}>
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              ) : (
                <LinearGradient
                  colors={GRADIENTES.boton.colors}
                  start={GRADIENTES.boton.start}
                  end={GRADIENTES.boton.end}
                  style={styles.btnGuardar}
                >
                  <Text style={styles.btnGuardarText}>✓  Cambiar correo</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={onCerrar}
              disabled={cargando}
            >
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    maxHeight: "90%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  btnCerrar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCerrarText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "700",
  },
  correoActualWrap: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  correoActualLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  correoActualValor: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  campoWrap: { marginBottom: 14 },
  campoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "android" ? 10 : 13,
    fontSize: 14,
    color: "#111827",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputFlex: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "android" ? 10 : 13,
    fontSize: 14,
    color: "#111827",
  },
  btnVerContrasena: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  btnVerContrasenaText: { fontSize: 18 },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
  },
  notaWrap: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 20,
  },
  notaText: {
    fontSize: 12,
    color: "#1D4ED8",
    lineHeight: 18,
  },
  btnGuardarWrap: {
    borderRadius: 12,
    marginBottom: 10,
  },
  btnGuardar: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnGuardarDisabled: { backgroundColor: "#93C5FD" },
  btnGuardarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  btnCancelar: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  btnCancelarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
});