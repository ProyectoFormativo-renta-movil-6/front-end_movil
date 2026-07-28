/**
 * RF50 — Editar información del usuario
 * RF50.1: Modificar nombre
 * RF50.3: Modificar teléfono
 * RF50.5: Guardar cambios validados
 * RF50.6: Cancelar edición
 */
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTES } from "@/constants/gradients";
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
import { useTranslation } from "react-i18next";
import { useTemaColores } from "@/modules/i18n/hooks/useLanguage";
import { ErroresPerfil, FormEditarPerfil as FormEditarPerfilType, Nacionalidad } from "../types/profile.types";

const NACIONALIDADES: { valor: Nacionalidad; bandera: string }[] = [
  { valor: "Colombia", bandera: "🇨🇴" },
  { valor: "USA", bandera: "🇺🇸" },
  { valor: "Francia", bandera: "🇫🇷" },
  { valor: "Portugal", bandera: "🇵🇹" },
  { valor: "Brasil", bandera: "🇧🇷" },
];

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
  const { t } = useTranslation();
  const c = useTemaColores();
  const [showNacionalidad, setShowNacionalidad] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingBottom: Platform.OS === "android" ? 80 : 40,
      }}
    >
      <View style={[styles.card, { backgroundColor: c.bgCard, borderColor: c.border }]}>
        <Text style={[styles.seccionLabel, { color: c.primary }]}>{t('perfil.datosEditables')}</Text>

        {/* Nombres */}
        <View style={styles.campoWrap}>
          <Text style={[styles.campoLabel, { color: c.textSecondary }]}>{t('perfil.nombres')} *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: c.bgInput, borderColor: c.border, color: c.textPrimary },
              errores.nombres ? styles.inputError : null,
            ]}
            value={form.nombres}
            onChangeText={(val) => onCambiar("nombres", val)}
            placeholder={t('perfil.placeholderNombres')}
            placeholderTextColor={c.textMuted}
            autoCapitalize="words"
          />
          {errores.nombres && (
            <Text style={styles.errorText}>{errores.nombres}</Text>
          )}
        </View>

        {/* Apellidos */}
        <View style={styles.campoWrap}>
          <Text style={[styles.campoLabel, { color: c.textSecondary }]}>{t('perfil.apellidos')} *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: c.bgInput, borderColor: c.border, color: c.textPrimary },
              errores.apellidos ? styles.inputError : null,
            ]}
            value={form.apellidos}
            onChangeText={(val) => onCambiar("apellidos", val)}
            placeholder={t('perfil.placeholderApellidos')}
            placeholderTextColor={c.textMuted}
            autoCapitalize="words"
          />
          {errores.apellidos && (
            <Text style={styles.errorText}>{errores.apellidos}</Text>
          )}
        </View>

        {/* Teléfono */}
        <View style={styles.campoWrap}>
          <Text style={[styles.campoLabel, { color: c.textSecondary }]}>{t('perfil.telefono')} *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: c.bgInput, borderColor: c.border, color: c.textPrimary },
              errores.telefono ? styles.inputError : null,
            ]}
            value={form.telefono}
            onChangeText={(val) => onCambiar("telefono", val)}
            placeholder={t('perfil.placeholderTelefono')}
            placeholderTextColor={c.textMuted}
            keyboardType="phone-pad"
            maxLength={20}
          />
          {errores.telefono && (
            <Text style={styles.errorText}>{errores.telefono}</Text>
          )}
        </View>

        {/* Nacionalidad */}
        <View style={styles.campoWrap}>
          <Text style={[styles.campoLabel, { color: c.textSecondary }]}>{t('perfil.nacionalidad')} *</Text>
          <TouchableOpacity
            style={[
              styles.selector,
              { borderColor: errores.nacionalidad ? "#DC2626" : c.border, backgroundColor: c.bgInput },
            ]}
            onPress={() => setShowNacionalidad((v) => !v)}
          >
            <Text style={[styles.selectorText, { color: form.nacionalidad ? c.textPrimary : c.textMuted }]}>
              {form.nacionalidad
                ? `${NACIONALIDADES.find((n) => n.valor === form.nacionalidad)?.bandera ?? ""} ${form.nacionalidad}`
                : t("perfil.seleccionar")}
            </Text>
            <Text style={{ color: c.textSecondary }}>▾</Text>
          </TouchableOpacity>
          {showNacionalidad && (
            <View style={[styles.dropdown, { borderColor: c.border, backgroundColor: c.bgCard }]}>
              {NACIONALIDADES.map(({ valor, bandera }) => (
                <TouchableOpacity
                  key={valor}
                  style={[
                    styles.dropdownItem,
                    form.nacionalidad === valor && { backgroundColor: c.primaryBg },
                  ]}
                  onPress={() => {
                    onCambiar("nacionalidad", valor);
                    setShowNacionalidad(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      { color: form.nacionalidad === valor ? c.primary : c.textPrimary },
                    ]}
                  >
                    {bandera} {valor}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errores.nacionalidad && <Text style={styles.errorText}>{errores.nacionalidad}</Text>}
        </View>

        {/* Código postal */}
        <View style={styles.campoWrap}>
          <Text style={[styles.campoLabel, { color: c.textSecondary }]}>{t('perfil.codigoPostal')}</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: c.bgInput, borderColor: c.border, color: c.textPrimary },
              errores.codigoPostal ? styles.inputError : null,
            ]}
            value={form.codigoPostal}
            onChangeText={(val) => onCambiar("codigoPostal", val)}
            placeholder={t('perfil.placeholderCodigoPostal')}
            placeholderTextColor={c.textMuted}
            autoCapitalize="characters"
            maxLength={10}
          />
          {errores.codigoPostal && (
            <Text style={styles.errorText}>{errores.codigoPostal}</Text>
          )}
        </View>

        {/* Nota campos no editables */}
        <View style={[styles.notaWrap, { backgroundColor: c.primaryBg, borderColor: c.border }]}>
          <Text style={[styles.notaText, { color: c.primary }]}>
            ℹ️ {t('perfil.notaCamposNoEditables')}
          </Text>
        </View>
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
            <Text style={styles.btnGuardarText}>{t('perfil.btnGuardar')}</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btnCancelar, { borderColor: c.border, backgroundColor: c.bgCard }]}
        onPress={onCancelar}
        activeOpacity={0.85}
        disabled={cargando}
      >
        <Text style={[styles.btnCancelarText, { color: c.textSecondary }]}>{t('perfil.cancelar')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  seccionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  campoWrap: { marginBottom: 14 },
  campoLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "android" ? 10 : 13,
    fontSize: 14,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "android" ? 10 : 13,
  },
  selectorText: { fontSize: 14 },
  dropdown: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dropdownText: { fontSize: 13.5, fontWeight: "600" },
  notaWrap: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  notaText: {
    fontSize: 12,
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
  },
  btnCancelarText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
