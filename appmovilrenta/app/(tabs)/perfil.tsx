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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePerfil } from "@/modules/perfil/hooks/usePerfil";
import { ModalCambiarCorreo } from "@/modules/perfil/components/ModalCambiarCorreo";
import { perfilStyles as styles } from "./_perfil.styles";

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const [editando, setEditando] = useState(false);

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
  } = usePerfil();

  const handleGuardar = () => {
    guardarCambios(
      () => {
        Alert.alert(
          "✅ Cambios guardados",
          "Tu información fue actualizada correctamente.",
          [{ text: "OK", onPress: () => setEditando(false) }]
        );
      },
      () => {
        Alert.alert(
          "❌ Error",
          "Por favor revisa los campos marcados.",
          [{ text: "Entendido" }]
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
          "✅ Correo actualizado",
          "Tu correo fue cambiado correctamente.",
          [{ text: "OK" }]
        );
      },
      (msg) => {
        Alert.alert("❌ Error", msg, [{ text: "Entendido" }]);
      }
    );
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            // RF43.9 — Cerrar sesión segura — se conecta al backend
            console.log("Cerrar sesión");
          },
        },
      ]
    );
  };

  const handleEliminarCuenta = () => {
    Alert.alert(
      "⚠️ Eliminar cuenta",
      "Esta acción es irreversible. ¿Deseas eliminar tu cuenta definitivamente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // RF52 — Eliminar cuenta — se conecta al backend
            console.log("Eliminar cuenta");
          },
        },
      ]
    );
  };

  // ── Vista editar perfil ───────────────────────────────────────────────────
  if (editando) {
    return (
      <View style={[styles.editContainer, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header editar */}
        <View style={styles.editHeader}>
          <TouchableOpacity
            style={styles.editHeaderBack}
            onPress={handleCancelar}
          >
            <Text style={styles.editHeaderBackText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.editHeaderTitle}>Editar Perfil</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: Platform.OS === "android" ? 100 : 60,
          }}
        >
          {/* Avatar */}
          <View style={styles.editAvatarWrap}>
            <View style={styles.editAvatar}>
              <Text style={styles.editAvatarText}>
                {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
              </Text>
              <View style={styles.editAvatarPlus}>
                <Text style={styles.editAvatarPlusText}>+</Text>
              </View>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.editCard}>
            {/* Nombre completo */}
            <View style={styles.editCampoWrap}>
              <Text style={styles.editCampoLabel}>Nombre Completo</Text>
              <TextInput
                style={[
                  styles.editInput,
                  errores.nombre ? styles.editInputError : null,
                ]}
                value={form.nombre}
                onChangeText={(val) => actualizarCampo("nombre", val)}
                placeholder="Tu nombre"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
              {errores.nombre && (
                <Text style={styles.editErrorText}>{errores.nombre}</Text>
              )}
            </View>

            {/* Apellido */}
            <View style={styles.editCampoWrap}>
              <Text style={styles.editCampoLabel}>Apellido</Text>
              <TextInput
                style={[
                  styles.editInput,
                  errores.apellido ? styles.editInputError : null,
                ]}
                value={form.apellido}
                onChangeText={(val) => actualizarCampo("apellido", val)}
                placeholder="Tu apellido"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
              {errores.apellido && (
                <Text style={styles.editErrorText}>{errores.apellido}</Text>
              )}
            </View>

            {/* Teléfono */}
            <View style={styles.editCampoWrap}>
              <Text style={styles.editCampoLabel}>Teléfono de contacto</Text>
              <TextInput
                style={[
                  styles.editInput,
                  errores.telefono ? styles.editInputError : null,
                ]}
                value={form.telefono}
                onChangeText={(val) => actualizarCampo("telefono", val)}
                placeholder="+57 300 000 0000"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errores.telefono && (
                <Text style={styles.editErrorText}>{errores.telefono}</Text>
              )}
            </View>

            {/* Dirección */}
            <View style={styles.editCampoWrap}>
              <Text style={styles.editCampoLabel}>Dirección de residencia</Text>
              <TextInput
                style={styles.editInput}
                placeholder="Calle 10 # 24-50, Neiva"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Botón guardar */}
          <TouchableOpacity
            style={[
              styles.editBtnGuardar,
              cargando && styles.editBtnGuardarDisabled,
            ]}
            onPress={handleGuardar}
            activeOpacity={0.85}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.editBtnGuardarText}>GUARDAR CAMBIOS</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── Vista principal perfil ─────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "android" ? 100 : 60,
        }}
      >
        {/* Card usuario */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {usuario.nombre} {usuario.apellido}
            </Text>
            <Text style={styles.userEmail}>{usuario.correo}</Text>
          </View>
          <TouchableOpacity
            style={styles.btnEditar}
            onPress={() => setEditando(true)}
          >
            <Text style={styles.btnEditarText}>EDITAR</Text>
          </TouchableOpacity>
        </View>

        {/* Menú opciones */}
        <View style={styles.menuSection}>
          {/* Historial de viajes */}
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemBorder]}
            onPress={() => console.log("Historial")}
          >
            <View style={styles.menuIconWrap}>
              <Text style={styles.menuIcon}>📋</Text>
            </View>
            <View style={styles.menuTextos}>
              <Text style={styles.menuLabel}>Historial de viajes</Text>
              <Text style={styles.menuSub}>Ver tus reservas anteriores</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          {/* Seguridad y contraseña */}
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemBorder]}
            onPress={() => setMostrarModalCorreo(true)}
          >
            <View style={styles.menuIconWrap}>
              <Text style={styles.menuIcon}>🔐</Text>
            </View>
            <View style={styles.menuTextos}>
              <Text style={styles.menuLabel}>Seguridad y Contraseña</Text>
              <Text style={styles.menuSub}>Cambiar correo o contraseña</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          {/* Mis tarjetas */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => console.log("Tarjetas")}
          >
            <View style={styles.menuIconWrap}>
              <Text style={styles.menuIcon}>💳</Text>
            </View>
            <View style={styles.menuTextos}>
              <Text style={styles.menuLabel}>Mis tarjetas de pago</Text>
              <Text style={styles.menuSub}>Gestiona tus métodos de pago</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Cerrar sesión */}
        <View style={styles.cerrarSection}>
          <TouchableOpacity
            style={styles.cerrarBtn}
            onPress={handleCerrarSesion}
          >
            <View style={styles.cerrarIconWrap}>
              <Text style={styles.menuIcon}>→</Text>
            </View>
            <Text style={styles.cerrarLabel}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Eliminar cuenta */}
        <View style={styles.eliminarWrap}>
          <TouchableOpacity
            style={styles.eliminarBtn}
            onPress={handleEliminarCuenta}
          >
            <Text style={styles.eliminarText}>
              Eliminar mi cuenta definitivamente
            </Text>
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