/**
 * RF50 — Editar información del usuario
 * RF50.1: Modificar nombre
 * RF50.3: Modificar teléfono
 * RF50.5: Guardar cambios validados
 * RF50.6: Cancelar edición
 */
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ErroresPerfil, FormEditarPerfil as FormEditarPerfilType } from "../types/perfil.types";

interface Props {
  form: FormEditarPerfilType;
  errores: ErroresPerfil;
  cargando: boolean;
  onCambiar: (campo: keyof FormEditarPerfilType, valor: string) => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

export function FormEditarPerfil({
  form,
  errores,
  cargando,
  onCambiar,
  onGuardar,
  onCancelar,
}: Props) {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingBottom: Platform.OS === "android" ? 80 : 40,
      }}
    >
      <View style={styles.card}>
        <Text style={styles.seccionLabel}>DATOS EDITABLES</Text>

        {/* Nombre */}
        <View style={styles.campoWrap}>
          <Text style={styles.campoLabel}>Nombre *</Text>
          <TextInput
            style={[styles.input, errores.nombre ? styles.inputError : null]}
            value={form.nombre}
            onChangeText={(val) => onCambiar("nombre", val)}
            placeholder="Tu nombre"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
          {errores.nombre && (
            <Text style={styles.errorText}>{errores.nombre}</Text>
          )}
        </View>

        {/* Apellido */}
        <View style={styles.campoWrap}>
          <Text style={styles.campoLabel}>Apellido *</Text>
          <TextInput
            style={[styles.input, errores.apellido ? styles.inputError : null]}
            value={form.apellido}
            onChangeText={(val) => onCambiar("apellido", val)}
            placeholder="Tu apellido"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
          {errores.apellido && (
            <Text style={styles.errorText}>{errores.apellido}</Text>
          )}
        </View>

        {/* Teléfono */}
        <View style={styles.campoWrap}>
          <Text style={styles.campoLabel}>Teléfono *</Text>
          <TextInput
            style={[styles.input, errores.telefono ? styles.inputError : null]}
            value={form.telefono}
            onChangeText={(val) => onCambiar("telefono", val)}
            placeholder="3001234567"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errores.telefono && (
            <Text style={styles.errorText}>{errores.telefono}</Text>
          )}
        </View>

        {/* Nota campos no editables */}
        <View style={styles.notaWrap}>
          <Text style={styles.notaText}>
            ℹ️ Cédula, fecha de nacimiento y nacionalidad no son editables.
            Para cambiar estos datos contacta al soporte.
          </Text>
        </View>
      </View>

      {/* Botones */}
      <TouchableOpacity
        style={[styles.btnGuardar, cargando && styles.btnGuardarDisabled]}
        onPress={onGuardar}
        activeOpacity={0.85}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnGuardarText}>✓  Guardar cambios</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnCancelar}
        onPress={onCancelar}
        activeOpacity={0.85}
        disabled={cargando}
      >
        <Text style={styles.btnCancelarText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  seccionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D4ED8",
    letterSpacing: 1.2,
    marginBottom: 16,
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
    marginTop: 8,
  },
  notaText: {
    fontSize: 12,
    color: "#1D4ED8",
    lineHeight: 18,
  },
  btnGuardar: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
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