import { InputField } from "@/components/ui/InputField";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useLogin } from "@/modules/auth/hooks/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SocialAuthButtons } from "@/modules/auth/components/SocialAuthButtons";
import { loginStyles as styles } from "@/modules/auth/styles/login.styles";

export default function LoginScreen() {
  const { t } = useTranslation();
  const c = useTemaColores();
  const { form, errores, cargando, bloqueado, actualizarCampo, iniciarSesion } =
    useLogin();
  const errorGlobal = errores.find((e) => !e.campo)?.mensaje;
  const [loginExitoso, setLoginExitoso] = useState(false);

  function handleLogin() {
    iniciarSesion(() => {
      setLoginExitoso(true);
      setTimeout(() => router.replace("/(tabs)"), 1500);
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

        {/* ── Banner éxito ───────────────────────────────────── */}
        {loginExitoso ? (
          <View style={loginLocalS.bannerExito}>
            <Text style={loginLocalS.bannerExitoTexto}>✓ {t("auth.login.exitoMsg")}</Text>
          </View>
        ) : null}

        {/* ── Banner error global (bloqueo / credenciales) ───── */}
        {!loginExitoso && errorGlobal ? (
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

          <SocialAuthButtons
            onGoogle={() => console.log("Google login")}
            onFacebook={() => console.log("Facebook login")}
          />

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

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const loginLocalS = StyleSheet.create({
  bannerExito: {
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#6EE7B7",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bannerExitoTexto: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
});
