import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useOlvideContrasena } from "@/modules/auth/hooks/useAuth";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { olvideStyles as styles } from "./olvide-contrasena.styles";

const SEGUNDOS_ESPERA = 30;

export default function OlvideContrasenaScreen() {
  const { form, errores, cargando, enviado, actualizarCorreo, enviarEnlace } =
    useOlvideContrasena();

  const [contador, setContador] = useState(0);
  const [puedeReenviar, setPuedeReenviar] = useState(false);
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Inicia el contador cada vez que se envía el enlace
  useEffect(() => {
    if (enviado) {
      iniciarContador();
    }
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [enviado]);

  function iniciarContador() {
    setPuedeReenviar(false);
    setContador(SEGUNDOS_ESPERA);
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    intervaloRef.current = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(intervaloRef.current!);
          setPuedeReenviar(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleReenviar() {
    enviarEnlace();
    iniciarContador();
  }

  // ── Pantalla de éxito ────────────────────────────────────────
  if (enviado) {
    return (
      <View style={styles.contenedorExito}>
        <Text style={styles.iconoExito}>✉️</Text>
        <Text style={styles.tituloExito}>Revisa tu correo</Text>
        <Text style={styles.mensajeExito}>
          Si el correo está registrado, recibirás un enlace para restablecer tu
          contraseña. Puede tardar unos minutos.
        </Text>
        <PrimaryButton
          titulo="Volver al inicio de sesión"
          onPress={() => router.replace("/(auth)/login")}
        />

        {/* ── Reenvío con contador ─────────────────────────── */}
        <View style={styles.contenedorReenvio}>
          <Text style={styles.textoReenvio}>¿No recibiste el correo?</Text>
          {puedeReenviar ? (
            <TouchableOpacity
              style={styles.botonReenvio}
              onPress={handleReenviar}
            >
              <Text style={styles.textoBotonReenvio}>Reenviar enlace</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.textoContador}>
              Reenviar en {contador} segundo{contador !== 1 ? "s" : ""}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/registro")}
          style={styles.enlaceRegistro}
        >
          <Text style={styles.textoEnlaceRegistro}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Pantalla principal ───────────────────────────────────────
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.botonVolver}
        >
          <Text style={styles.textoVolver}>← Volver</Text>
        </TouchableOpacity>

        {/* ── Encabezado con logo ────────────────────────────── */}
        <View style={styles.encabezado}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.titulo}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitulo}>
            Ingresa tu correo registrado y te enviaremos un enlace para
            recuperar el acceso.
          </Text>
        </View>

        <InputField
          label="Correo electrónico *"
          placeholder="ejemplo@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.correo}
          onChangeText={actualizarCorreo}
          error={errores.find((e) => e.campo === "correo")?.mensaje}
        />

        <PrimaryButton
          titulo="Enviar enlace de recuperación"
          onPress={enviarEnlace}
          cargando={cargando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
