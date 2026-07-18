// app/(auth)/login.tsx

import { AlertModal } from "@/components/ui/AlertModal";
import { InputField } from "@/components/ui/InputField";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SocialAuthButtons } from "@/modules/auth/components/SocialAuthButtons";
import { useLogin } from "@/modules/auth/hooks/useAuth";
import { loginStyles as styles } from "@/modules/auth/styles/login.styles";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Tab = "login" | "bienvenida";

const ACCESOS = [
  { icono: "calendar-outline", texto: "Mis\nreservas" },
  { icono: "card-outline", texto: "Mis\npagos" },
  { icono: "document-text-outline", texto: "Mis\ncontratos" },
];

const BENEFICIOS = [
  "Reserva en minutos",
  "Paga con Nequi o PSE",
  "Contrato digital inmediato",
];

export default function LoginScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("login");
  const { form, errores, cargando, bloqueado, actualizarCampo, iniciarSesion } =
    useLogin();
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const errorGlobal = errores.find((e) => !e.campo)?.mensaje;
  const [loginExitoso, setLoginExitoso] = useState(false);

  // ── Control de las alertas tipo modal ─────────────────────────
  const [alertaErrorVisible, setAlertaErrorVisible] = useState(false);
  const [alertaExitoVisible, setAlertaExitoVisible] = useState(false);

  useEffect(() => {
    if (errorGlobal && !loginExitoso) {
      setAlertaErrorVisible(true);
    }
  }, [errorGlobal, loginExitoso]);

  useEffect(() => {
    if (loginExitoso) {
      setAlertaExitoVisible(true);
    }
  }, [loginExitoso]);

  function handleLogin() {
    iniciarSesion((usuarioEncontrado) => {
      setUsuario(
        {
          id: usuarioEncontrado.id,
          correo: usuarioEncontrado.correo,
          nombres: usuarioEncontrado.nombres,
          apellidos: usuarioEncontrado.apellidos,
          rol: usuarioEncontrado.rol as "cliente" | "administrador" | "operador" | "supervisor",
        },
        "token-demo",
      );
      setLoginExitoso(true);
      setTimeout(() => router.replace("/(tabs)/catalogo"), 1500);
    });
  }

  function handleInvitado() {
    router.replace("/(tabs)/catalogo");
  }

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContenedor}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          <View>
            {/* BARRA SUPERIOR BLANCA */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.volverBtn}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={20} color="#1E3A8A" />
                <Text style={styles.volverTexto}>Volver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.invitadoBtn}
                onPress={handleInvitado}
              >
                <Text style={styles.invitadoBtnTexto}>Modo invitado</Text>
              </TouchableOpacity>
            </View>

            {/* HEADER AZUL */}
            <View style={styles.header}>
              <View style={styles.marcaWrapper}>
                <Text style={styles.marca}>Drivique</Text>
                <Text style={styles.marcaTagline}>
                  Distintivo, elegante y memorable
                </Text>
              </View>

              {/* SWITCH DE PESTAÑAS */}
              <View style={styles.tabsWrapper}>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    tab === "login" && styles.tabBtnActivo,
                  ]}
                  onPress={() => setTab("login")}
                >
                  <Text
                    style={[
                      styles.tabBtnTexto,
                      tab === "login" && styles.tabBtnTextoActivo,
                    ]}
                  >
                    Iniciar sesión
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    tab === "bienvenida" && styles.tabBtnActivo,
                  ]}
                  onPress={() => setTab("bienvenida")}
                >
                  <Text
                    style={[
                      styles.tabBtnTexto,
                      tab === "bienvenida" && styles.tabBtnTextoActivo,
                    ]}
                  >
                    Bienvenida
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* CUERPO CON CARD FLOTANTE */}
            <View style={styles.cuerpo}>
              {tab === "login" ? (
                <View style={styles.cardWrapper}>
                  {/* LOGO A CABALLO ENTRE EL HEADER Y LA CARD */}
                  <View style={styles.logoBadge}>
                    <Image
                      source={require("@/assets/images/logo.png")}
                      style={styles.logoBadgeImg}
                    />
                  </View>

                  <View style={styles.card}>
                    <View style={styles.encabezado}>
                      <Text style={styles.titulo}>Iniciar sesión</Text>
                      <Text style={styles.subtitulo}>
                        Ingresa tus credenciales para continuar
                      </Text>
                    </View>

                    <View style={styles.formulario}>
                      <InputField
                        label={`${t("auth.login.correo")} *`}
                        placeholder="ejemplo@correo.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.correo}
                        onChangeText={(val) => actualizarCampo("correo", val)}
                        error={
                          errores.find((e) => e.campo === "correo")?.mensaje
                        }
                      />
                      <PasswordInput
                        label={`${t("auth.login.contrasena")} *`}
                        placeholder={t("auth.login.contrasena")}
                        value={form.contrasena}
                        onChangeText={(val) =>
                          actualizarCampo("contrasena", val)
                        }
                        error={
                          errores.find((e) => e.campo === "contrasena")
                            ?.mensaje
                        }
                      />
                      <TouchableOpacity
                        onPress={() =>
                          router.push("/(auth)/olvide-contrasena")
                        }
                        style={styles.enlaceOlvide}
                      >
                        <Text style={styles.textoEnlace}>
                          {t("auth.login.olvidaste")}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.acciones}>
                      <PrimaryButton
                        titulo={
                          bloqueado
                            ? t("auth.login.bloqueado")
                            : t("auth.login.iniciarSesion")
                        }
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
                    </View>

                    <View style={loginLocalS.registroRow}>
                      <Text style={loginLocalS.registroTexto}>
                        ¿No tienes cuenta?{" "}
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.push("/(auth)/registro")}
                      >
                        <Text style={loginLocalS.registroLink}>
                          Regístrate aquí
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.cardWrapper}>
                  <View style={styles.logoBadge}>
                    <Image
                      source={require("@/assets/images/logo.png")}
                      style={styles.logoBadgeImg}
                    />
                  </View>

                  <View style={styles.card}>
                    <View style={styles.encabezado}>
                      <Text style={styles.titulo}>Bienvenido de vuelta</Text>
                      <Text style={styles.subtitulo}>
                        Gestiona tus reservas, pagos y contratos desde un
                        solo lugar.
                      </Text>
                    </View>

                    <View style={styles.accesosRow}>
                      {ACCESOS.map((a) => (
                        <TouchableOpacity
                          key={a.texto}
                          style={styles.accesoBtn}
                          onPress={() => setTab("login")}
                        >
                          <Ionicons
                            name={a.icono as any}
                            size={22}
                            color="#FFFFFF"
                          />
                          <Text style={styles.accesoBtnTexto}>{a.texto}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.beneficiosCol}>
                      {BENEFICIOS.map((b) => (
                        <Text key={b} style={styles.beneficioTexto}>
                          {b}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerTexto}>Drivique © 2026</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ height: insets.bottom, backgroundColor: "#FFFFFF" }} />

      {/* ── ALERTA DE ERROR (mismo diseño y color que catálogo) ── */}
      <AlertModal
        visible={alertaErrorVisible}
        icono="alert-circle-outline"
        titulo="No pudimos iniciar sesión"
        mensaje={errorGlobal ?? "Revisa tus credenciales e inténtalo de nuevo."}
        botones={[
          {
            texto: "Entendido",
            variante: "primario",
            onPress: () => setAlertaErrorVisible(false),
          },
        ]}
        onCerrar={() => setAlertaErrorVisible(false)}
      />

      {/* ── ALERTA DE ÉXITO (mismo diseño y color que catálogo) ── */}
      <AlertModal
        visible={alertaExitoVisible}
        icono="checkmark-circle-outline"
        titulo="¡Bienvenido de nuevo!"
        mensaje={t("auth.login.exitoMsg")}
        botones={[]}
        onCerrar={() => setAlertaExitoVisible(false)}
      />
    </View>
  );
}

const loginLocalS = StyleSheet.create({
  registroRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registroTexto: {
    fontSize: 13.5,
    color: "#6B7280",
  },
  registroLink: {
    fontSize: 13.5,
    color: "#1D4ED8",
    fontWeight: "700",
  },
});