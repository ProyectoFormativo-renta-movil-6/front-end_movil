import { InputField } from "@/components/ui/InputField";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useLogin } from "@/modules/auth/hooks/useAuth";
import { useOnboarding } from "@/hooks/use-onboarding";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { loginStyles as styles } from "./_login.styles";

export default function LoginScreen() {
  const { t } = useTranslation();
  const c = useTemaColores();
  const { resetOnboarding } = useOnboarding();
  const { form, errores, cargando, bloqueado, actualizarCampo, iniciarSesion } =
    useLogin();
  const errorGlobal = errores.find((e) => !e.campo)?.mensaje;

  // TODO: quitar antes de producción
  function handleResetOnboarding() {
    resetOnboarding();
    router.replace("/");
  }

  function handleLogin() {
    iniciarSesion(() => {
      // Usuario registrado → va al catálogo con todas las funcionalidades
      router.replace("/(tabs)");
    });
  }

  function handleInvitado() {
    // Invitado → va al catálogo con funcionalidades limitadas
    router.push("/(auth)/invitado");
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: c.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenedor}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Encabezado con logo ────────────────────────────── */}
        <View style={styles.encabezado}>
          <View style={[styles.logoWrapper, { backgroundColor: c.primaryBg }]}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
          <Text style={[styles.titulo, { color: c.textPrimary }]}>{t("auth.login.bienvenido")}</Text>
          <Text style={[styles.subtitulo, { color: c.textSecondary }]}>{t("auth.login.subtitulo")}</Text>
        </View>

        {/* ── Banner error global (bloqueo / credenciales) ───── */}
        {errorGlobal ? (
          <View style={styles.bannerError}>
            <Text style={styles.bannerErrorTexto}>⚠️ {errorGlobal}</Text>
          </View>
        ) : null}

        {/* ── Formulario ─────────────────────────────────────── */}
        <View style={styles.formulario}>
          <InputField
            label={`${t("auth.login.correo")} *`}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.correo}
            onChangeText={(val) => actualizarCampo("correo", val)}
            error={errores.find((e) => e.campo === "correo")?.mensaje}
          />
          <PasswordInput
            label={`${t("auth.login.contrasena")} *`}
            placeholder={t("auth.login.contrasena")}
            value={form.contrasena}
            onChangeText={(val) => actualizarCampo("contrasena", val)}
            error={errores.find((e) => e.campo === "contrasena")?.mensaje}
          />
          <TouchableOpacity
            onPress={() => router.push("/(auth)/olvide-contrasena")}
            style={styles.enlaceOlvide}
          >
            <Text style={styles.textoEnlace}>{t("auth.login.olvidaste")}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Acciones ───────────────────────────────────────── */}
        <View style={styles.acciones}>
          <PrimaryButton
            titulo={bloqueado ? t("auth.login.bloqueado") : t("auth.login.iniciarSesion")}
            onPress={handleLogin}
            cargando={cargando}
            deshabilitado={bloqueado}
          />

          {bloqueado ? (
            <Text style={styles.hintBloqueado}>
              {t("auth.login.hintBloqueado")}
            </Text>
          ) : null}

          <View style={styles.separador}>
            <View style={[styles.lineaSeparador, { backgroundColor: c.border }]} />
            <Text style={[styles.textoSeparador, { color: c.textMuted }]}>{t("auth.login.separador")}</Text>
            <View style={[styles.lineaSeparador, { backgroundColor: c.border }]} />
          </View>

          <PrimaryButton
            titulo={t("auth.login.crearCuenta")}
            variante="secundario"
            onPress={() => router.push("/(auth)/registro")}
          />
          <PrimaryButton
            titulo={t("auth.login.invitado")}
            variante="texto"
            onPress={handleInvitado}
          />

          {/* TODO: quitar antes de producción */}
          <TouchableOpacity
            onPress={handleResetOnboarding}
            style={{ marginTop: 24, alignItems: "center" }}
          >
            <Text style={{ fontSize: 11, color: "#DC2626" }}>
              🔄 [DEV] Ver onboarding de nuevo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
