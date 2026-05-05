import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useLogin } from '@/modules/auth/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { loginStyles as styles } from './_login.styles';

export default function LoginScreen() {
  const { form, errores, cargando, bloqueado, actualizarCampo, iniciarSesion } = useLogin();
  const errorGlobal = errores.find(e => !e.campo)?.mensaje;

  function handleLogin() {
    iniciarSesion(() => {
      router.replace('/(tabs)');
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenedor}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.encabezado}>
          <Text style={styles.marca}>🚗 Renta Móvil</Text>
          <Text style={styles.titulo}>Bienvenido de nuevo</Text>
          <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>
        </View>

        {errorGlobal ? (
          <View style={styles.bannerError}>
            <Text style={styles.bannerErrorTexto}>⚠️ {errorGlobal}</Text>
          </View>
        ) : null}

        <View style={styles.formulario}>
          <InputField
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.correo}
            onChangeText={val => actualizarCampo('correo', val)}
            error={errores.find(e => e.campo === 'correo')?.mensaje}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            value={form.contrasena}
            onChangeText={val => actualizarCampo('contrasena', val)}
            error={errores.find(e => e.campo === 'contrasena')?.mensaje}
          />
          <TouchableOpacity
            onPress={() => router.push('/(auth)/olvide-contrasena')}
            style={styles.enlaceOlvide}
          >
            <Text style={styles.textoEnlace}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.acciones}>
          <PrimaryButton
            titulo="Iniciar sesión"
            onPress={handleLogin}
            cargando={cargando}
            deshabilitado={bloqueado}
          />
          <View style={styles.separador}>
            <View style={styles.lineaSeparador} />
            <Text style={styles.textoSeparador}>o</Text>
            <View style={styles.lineaSeparador} />
          </View>
          <PrimaryButton
            titulo="Crear cuenta nueva"
            variante="secundario"
            onPress={() => router.push('/(auth)/registro')}
          />
          <PrimaryButton
            titulo="Continuar como invitado"
            variante="texto"
            onPress={() => router.push('/(auth)/invitado')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}