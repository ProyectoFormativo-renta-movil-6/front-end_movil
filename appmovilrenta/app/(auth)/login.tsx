import { InputField } from "@/components/ui/InputField";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useLogin } from "@/modules/auth/hooks/useAuth";
import { router } from "expo-router";
import React from "react";
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
  const { form, errores, cargando, bloqueado, actualizarCampo, iniciarSesion } =
    useLogin();
  const errorGlobal = errores.find((e) => !e.campo)?.mensaje;

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
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenedor}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Encabezado con logo ────────────────────────────── */}
        <View style={styles.encabezado}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.titulo}>Bienvenido de nuevo</Text>
          <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>
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
            label="Correo electrónico *"
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.correo}
            onChangeText={(val) => actualizarCampo("correo", val)}
            error={errores.find((e) => e.campo === "correo")?.mensaje}
          />
          <PasswordInput
            label="Contraseña *"
            placeholder="Tu contraseña"
            value={form.contrasena}
            onChangeText={(val) => actualizarCampo("contrasena", val)}
            error={errores.find((e) => e.campo === "contrasena")?.mensaje}
          />
          <TouchableOpacity
            onPress={() => router.push("/(auth)/olvide-contrasena")}
            style={styles.enlaceOlvide}
          >
            <Text style={styles.textoEnlace}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* ── Acciones ───────────────────────────────────────── */}
        <View style={styles.acciones}>
          <PrimaryButton
            titulo={bloqueado ? "Cuenta bloqueada" : "Iniciar sesión"}
            onPress={handleLogin}
            cargando={cargando}
            deshabilitado={bloqueado}
          />

          {bloqueado ? (
            <Text style={styles.hintBloqueado}>
              Cuenta bloqueada tras 3 intentos. Usa ¿Olvidaste tu contraseña?
            </Text>
          ) : null}

          <View style={styles.separador}>
            <View style={styles.lineaSeparador} />
            <Text style={styles.textoSeparador}>o</Text>
            <View style={styles.lineaSeparador} />
          </View>

          <PrimaryButton
            titulo="Crear cuenta nueva"
            variante="secundario"
            onPress={() => router.push("/(auth)/registro")}
          />
          <PrimaryButton
            titulo="Continuar como invitado"
            variante="texto"
            onPress={handleInvitado}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
