/**
 * RF50 — Editar información del usuario
 * RF50.1: Modificar nombre
 * RF50.2: Modificar correo
 * RF50.3: Modificar teléfono
 * RF50.4: Validar contraseña actual
 * RF50.5: Guardar cambios validados
 * RF50.6: Cancelar edición
 */
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { IdiomaKey, IDIOMAS } from "@/modules/i18n";
import { useIdioma, useTemaColores } from "@/modules/i18n/hooks/useIdioma";
import { usePerfil } from "@/modules/perfil/hooks/usePerfil";
import { ModalCambiarCorreo } from "@/modules/perfil/components/ModalCambiarCorreo";
import { FormCompletarPerfil } from "@/modules/perfil/components/FormCompletarPerfil";
import { perfilStyles as styles } from "@/modules/perfil/styles/perfil.styles";
import { useAuthStore } from "@/store/authStore";
import { useUsuarioStore } from "@/store/usuarioStore";
import { eliminarUsuarioDemo } from "@/mocks/usuariosDemo";

export default function PerfilScreen() {
  const { t } = useTranslation();
  const { idiomaActual, cambiarIdioma, temaActual, cambiarTema } = useIdioma();
  const c = useTemaColores();
  const insets = useSafeAreaInsets();
  const [editando, setEditando] = useState(false);
  const [completando, setCompletando] = useState(false);

  const authUsuario = useAuthStore((s) => s.usuario);
  const cerrarSesionAuth = useAuthStore((s) => s.cerrarSesion);
  const limpiarUsuario = useUsuarioStore((s) => s.limpiarUsuario);

  const {
    usuario,
    cargando,
    form,
    formCorreo,
    errores,
    erroresCorreo,
    actualizarCampo,
    actualizarCampoCorreo,
    guardarCambios,
    cancelarEdicion,
    mostrarModalCorreo,
    setMostrarModalCorreo,
    guardarCambioCorreo,
    cerrarModalCorreo,
    marcarPerfilCompleto,
  } = usePerfil();

  const handleGuardar = () => {
    guardarCambios(
      () => {
        Alert.alert(
          t("perfil.cambiosGuardados"),
          t("perfil.cambiosGuardadosMsg"),
          [{ text: t("perfil.ok"), onPress: () => setEditando(false) }]
        );
      },
      () => {
        Alert.alert(
          t("perfil.errorTitulo"),
          t("perfil.errorMsg"),
          [{ text: t("perfil.errorBtn") }]
        );
      }
    );
  };

  const handleCancelar = () => {
    cancelarEdicion();
    setEditando(false);
  };

  const handleGuardarCorreo = () => {
    guardarCambioCorreo(
      () => {
        Alert.alert(
          t("perfil.correoActualizadoTitulo"),
          t("perfil.correoActualizadoMsg"),
          [{ text: t("perfil.ok") }]
        );
      },
      (msg) => {
        Alert.alert(t("perfil.errorTitulo"), msg, [{ text: t("perfil.errorBtn") }]);
      }
    );
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      t("perfil.cerrarSesionTitulo"),
      t("perfil.cerrarSesionMsg"),
      [
        { text: t("perfil.cancelar"), style: "cancel" },
        {
          text: t("perfil.confirmarCerrar"),
          style: "destructive",
          onPress: () => {
            // RF43.9 — Cerrar sesión segura
            // En producción esto además invalida el token en el backend;
            // por ahora limpiamos ambos stores locales y volvemos al login.
            cerrarSesionAuth();
            limpiarUsuario();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const handleEliminarCuenta = () => {
    Alert.alert(
      t("perfil.eliminarTitulo"),
      t("perfil.eliminarMsg"),
      [
        { text: t("perfil.cancelar"), style: "cancel" },
        {
          text: t("perfil.confirmarEliminar"),
          style: "destructive",
          onPress: () => {
            // RF52 — Eliminar cuenta
            // En producción esto llama a DELETE /usuarios/:id contra el
            // backend. Mientras tanto, con datos mock, quitamos al usuario
            // de USUARIOS_DEMO (mocks/usuariosDemo.ts) para que ya no
            // pueda volver a iniciar sesión, y limpiamos ambos stores.
            const correo = authUsuario?.correo || usuario.correo;
            if (correo) eliminarUsuarioDemo(correo);
            cerrarSesionAuth();
            limpiarUsuario();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  // ── Vista completar perfil ────────────────────────────────────────────────
  if (completando) {
    return (
      <View style={[styles.editContainer, { paddingTop: insets.top, backgroundColor: c.bg }]}>
        <StatusBar barStyle={c.oscuro ? "light-content" : "dark-content"} backgroundColor={c.bgHeader} />
        <View style={[styles.editHeader, { backgroundColor: c.bgHeader, borderBottomColor: c.border }]}>
          <TouchableOpacity
            style={[styles.editHeaderBack, { backgroundColor: c.bgInput }]}
            onPress={() => setCompletando(false)}
          >
            <Text style={[styles.editHeaderBackText, { color: c.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.editHeaderTitle, { color: c.textPrimary }]}>{t("perfil.completarPerfil")}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "android" ? 100 : 60 }}
        >
          <FormCompletarPerfil
            onGuardado={() => {
              marcarPerfilCompleto();
              setCompletando(false);
            }}
          />
        </ScrollView>
      </View>
    );
  }

  // ── Vista editar perfil ───────────────────────────────────────────────────
  if (editando) {
    return (
      <View style={[styles.editContainer, { paddingTop: insets.top, backgroundColor: c.bg }]}>
        <StatusBar barStyle={c.oscuro ? "light-content" : "dark-content"} backgroundColor={c.bgHeader} />

        {/* Header */}
        <View style={[styles.editHeader, { backgroundColor: c.bgHeader, borderBottomColor: c.border }]}>
          <TouchableOpacity
            style={[styles.editHeaderBack, { backgroundColor: c.bgInput }]}
            onPress={handleCancelar}
          >
            <Text style={[styles.editHeaderBackText, { color: c.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.editHeaderTitle, { color: c.textPrimary }]}>{t("perfil.editarTitulo")}</Text>
        </View>

        {/* Avatar */}
        <View style={styles.editAvatarWrap}>
          <View style={styles.editAvatar}>
            <Text style={styles.editAvatarText}>
              {usuario.nombres.charAt(0)}{usuario.apellidos.charAt(0)}
            </Text>
            <View style={styles.editAvatarPlus}>
              <Text style={styles.editAvatarPlusText}>+</Text>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: Platform.OS === "android" ? 100 : 60 }}
        >
          {/* Formulario */}
          <View style={[styles.editCard, { backgroundColor: c.bgCard, borderColor: c.border }]}>
            <View style={styles.editCampoWrap}>
              <Text style={[styles.editCampoLabel, { color: c.textSecondary }]}>{t("perfil.nombres")}</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: c.bgInput, borderColor: c.border, color: c.textPrimary }, errores.nombres ? styles.editInputError : null]}
                value={form.nombres}
                onChangeText={(val) => actualizarCampo("nombres", val)}
                placeholder={t("perfil.placeholderNombres")}
                placeholderTextColor={c.textMuted}
                autoCapitalize="words"
              />
              {errores.nombres && <Text style={styles.editErrorText}>{errores.nombres}</Text>}
            </View>

            <View style={styles.editCampoWrap}>
              <Text style={[styles.editCampoLabel, { color: c.textSecondary }]}>{t("perfil.apellidos")}</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: c.bgInput, borderColor: c.border, color: c.textPrimary }, errores.apellidos ? styles.editInputError : null]}
                value={form.apellidos}
                onChangeText={(val) => actualizarCampo("apellidos", val)}
                placeholder={t("perfil.placeholderApellidos")}
                placeholderTextColor={c.textMuted}
                autoCapitalize="words"
              />
              {errores.apellidos && <Text style={styles.editErrorText}>{errores.apellidos}</Text>}
            </View>

            <View style={styles.editCampoWrap}>
              <Text style={[styles.editCampoLabel, { color: c.textSecondary }]}>{t("perfil.telefono")}</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: c.bgInput, borderColor: c.border, color: c.textPrimary }, errores.telefono ? styles.editInputError : null]}
                value={form.telefono}
                onChangeText={(val) => actualizarCampo("telefono", val)}
                placeholder={t("perfil.placeholderTelefono")}
                placeholderTextColor={c.textMuted}
                keyboardType="phone-pad"
                maxLength={20}
              />
              {errores.telefono && <Text style={styles.editErrorText}>{errores.telefono}</Text>}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.editBtnGuardar, cargando && styles.editBtnGuardarDisabled]}
            onPress={handleGuardar}
            activeOpacity={0.85}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.editBtnGuardarText}>{t("perfil.guardarCambios")}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── Vista principal perfil ─────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: c.bg }]}>
      <StatusBar barStyle={c.oscuro ? "light-content" : "dark-content"} backgroundColor={c.bgHeader} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: c.bgHeader, borderBottomColor: c.border }]}>
        <Text style={[styles.headerTitle, { color: c.textPrimary }]}>{t("perfil.titulo")}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "android" ? 100 : 60 }}
      >
        {/* Card usuario */}
        <View style={[styles.userCard, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {usuario.nombres.charAt(0)}{usuario.apellidos.charAt(0)}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: c.textPrimary }]}>
              {usuario.nombres} {usuario.apellidos}
            </Text>
            <Text style={[styles.userEmail, { color: c.textSecondary }]}>{usuario.correo}</Text>
          </View>
          <TouchableOpacity style={styles.btnEditar} onPress={() => setEditando(true)}>
            <Text style={styles.btnEditarText}>{t("perfil.editar")}</Text>
          </TouchableOpacity>
        </View>

        {/* Banner completar perfil */}
        {!usuario.perfilCompleto && (
          <TouchableOpacity
            style={[localS.banner, { backgroundColor: c.primaryBg, borderColor: "#1D4ED8" }]}
            onPress={() => setCompletando(true)}
            activeOpacity={0.85}
          >
            <View style={localS.bannerIcono}>
              <Text style={{ fontSize: 22 }}>👤</Text>
            </View>
            <View style={localS.bannerTextos}>
              <Text style={localS.bannerTitulo}>{t("perfil.completarPerfil")}</Text>
              <Text style={[localS.bannerSub, { color: c.textSecondary }]}>{t("perfil.completarPerfilSub")}</Text>
            </View>
            <Text style={{ color: "#1D4ED8", fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        )}

        {/* Menú opciones */}
        <View style={[styles.menuSection, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemBorder, { borderBottomColor: c.borderLight }]}
            onPress={() => console.log("Historial")}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: c.primaryBg }]}>
              <Text style={styles.menuIcon}>📋</Text>
            </View>
            <View style={styles.menuTextos}>
              <Text style={[styles.menuLabel, { color: c.textPrimary }]}>{t("perfil.historial")}</Text>
              <Text style={[styles.menuSub, { color: c.textMuted }]}>{t("perfil.historialSub")}</Text>
            </View>
            <Text style={[styles.menuArrow, { color: c.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemBorder, { borderBottomColor: c.borderLight }]}
            onPress={() => setMostrarModalCorreo(true)}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: c.primaryBg }]}>
              <Text style={styles.menuIcon}>🔐</Text>
            </View>
            <View style={styles.menuTextos}>
              <Text style={[styles.menuLabel, { color: c.textPrimary }]}>{t("perfil.seguridad")}</Text>
              <Text style={[styles.menuSub, { color: c.textMuted }]}>{t("perfil.seguridadSub")}</Text>
            </View>
            <Text style={[styles.menuArrow, { color: c.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Tarjetas")}>
            <View style={[styles.menuIconWrap, { backgroundColor: c.primaryBg }]}>
              <Text style={styles.menuIcon}>💳</Text>
            </View>
            <View style={styles.menuTextos}>
              <Text style={[styles.menuLabel, { color: c.textPrimary }]}>{t("perfil.tarjetas")}</Text>
              <Text style={[styles.menuSub, { color: c.textMuted }]}>{t("perfil.tarjetasSub")}</Text>
            </View>
            <Text style={[styles.menuArrow, { color: c.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Configuración: Tema e Idioma */}
        <View style={[configStyles.seccion, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <Text style={configStyles.seccionTitulo}>
            {t("config.tema")} &amp; {t("config.idioma")}
          </Text>

          <View style={configStyles.filaLabel}>
            <Text style={[configStyles.label, { color: c.textPrimary }]}>🎨 {t("config.tema")}</Text>
          </View>
          <View style={configStyles.temaRow}>
            <TouchableOpacity
              style={[configStyles.temaBtn, { borderColor: c.border, backgroundColor: c.bgInput }, temaActual === "claro" && configStyles.temaBtnActivo]}
              onPress={() => cambiarTema("claro")}
            >
              <Text style={[configStyles.temaBtnTexto, { color: c.textPrimary }, temaActual === "claro" && configStyles.temaBtnTextoActivo]}>
                {t("config.claro")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[configStyles.temaBtn, { borderColor: c.border, backgroundColor: c.bgInput }, temaActual === "oscuro" && configStyles.temaBtnActivoDark]}
              onPress={() => cambiarTema("oscuro")}
            >
              <Text style={[configStyles.temaBtnTexto, { color: c.textPrimary }, temaActual === "oscuro" && { color: "#F0F4FF" }]}>
                {t("config.oscuro")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[configStyles.filaLabel, { marginTop: 16 }]}>
            <Text style={[configStyles.label, { color: c.textPrimary }]}>🌐 {t("config.idioma")}</Text>
          </View>
          <View style={configStyles.idiomasWrap}>
            {(Object.keys(IDIOMAS) as IdiomaKey[]).map((key) => (
              <TouchableOpacity
                key={key}
                style={[configStyles.idiomaBtn, { borderColor: c.border, backgroundColor: c.bgInput }, idiomaActual === key && configStyles.idiomaBtnActivo]}
                onPress={() => cambiarIdioma(key)}
              >
                <Text style={configStyles.idiomaFlag}>{IDIOMAS[key].flag}</Text>
                <Text style={[configStyles.idiomaLabel, { color: c.textPrimary }, idiomaActual === key && configStyles.idiomaLabelActivo]}>
                  {IDIOMAS[key].label}
                </Text>
                {idiomaActual === key && (
                  <View style={configStyles.idiomaCheck}>
                    <Text style={{ fontSize: 10, color: "#fff", fontWeight: "800" }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cerrar sesión */}
        <View style={[styles.cerrarSection, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <TouchableOpacity style={styles.cerrarBtn} onPress={handleCerrarSesion}>
            <View style={styles.cerrarIconWrap}>
              <Text style={styles.menuIcon}>→</Text>
            </View>
            <Text style={styles.cerrarLabel}>{t("perfil.cerrarSesion")}</Text>
          </TouchableOpacity>
        </View>

        {/* Eliminar cuenta */}
        <View style={styles.eliminarWrap}>
          <TouchableOpacity
            style={styles.eliminarBtn}
            onPress={handleEliminarCuenta}
          >
            <Text style={styles.eliminarText}>{t("perfil.eliminarCuenta")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal cambiar correo */}
      <ModalCambiarCorreo
        visible={mostrarModalCorreo}
        form={formCorreo}
        errores={erroresCorreo}
        cargando={cargando}
        correoActual={usuario.correo}
        onCambiar={actualizarCampoCorreo}
        onGuardar={handleGuardarCorreo}
        onCerrar={cerrarModalCorreo}
      />
    </View>
  );
}

const localS = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  bannerIcono: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTextos: { flex: 1 },
  bannerTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D4ED8",
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 12,
    color: "#6B7280",
  },
});

const configStyles = StyleSheet.create({
  seccion: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  seccionTitulo: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D4ED8",
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  filaLabel: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  temaRow: {
    flexDirection: "row",
    gap: 10,
  },
  temaBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },
  temaBtnActivo: {
    backgroundColor: "#EEF2FF",
    borderColor: "#1D4ED8",
  },
  temaBtnActivoDark: {
    backgroundColor: "#1C2330",
    borderColor: "#4A5568",
  },
  temaBtnTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  temaBtnTextoActivo: {
    color: "#1D4ED8",
  },
  idiomasWrap: {
    gap: 8,
  },
  idiomaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  idiomaBtnActivo: {
    backgroundColor: "#EEF2FF",
    borderColor: "#1D4ED8",
  },
  idiomaFlag: {
    fontSize: 20,
  },
  idiomaLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  idiomaLabelActivo: {
    color: "#1D4ED8",
  },
  idiomaCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
  },
});