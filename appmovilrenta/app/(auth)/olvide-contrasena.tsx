import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useOlvideContrasena } from '@/modules/auth/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { olvideStyles as styles } from './olvide-contrasena.styles';

export default function OlvideContrasenaScreen() {
  const { form, errores, cargando, enviado, actualizarCorreo, enviarEnlace } =
    useOlvideContrasena();

  if (enviado) {
    return (
      <View style={styles.contenedorExito}>
        <Text style={styles.iconoExito}>✉️</Text>
        <Text style={styles.tituloExito}>Revisa tu correo</Text>
        <Text style={styles.mensajeExito}>
          Si el correo está registrado, recibirás un enlace para restablecer tu contraseña. Puede
          tardar unos minutos.
        </Text>
        <PrimaryButton
          titulo="Volver al inicio de sesión"
          onPress={() => router.replace('/(auth)/login')}
        />
        <TouchableOpacity
          onPress={() => router.push('/(auth)/registro')}
          style={styles.enlaceRegistro}
        >
          <Text style={styles.textoEnlaceRegistro}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    );
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
        <TouchableOpacity onPress={() => router.back()} style={styles.botonVolver}>
          <Text style={styles.textoVolver}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.icono}>🔑</Text>
        <Text style={styles.titulo}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.subtitulo}>
          Ingresa tu correo registrado y te enviaremos un enlace para recuperar el acceso.
        </Text>

        <InputField
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.correo}
          onChangeText={actualizarCorreo}
          error={errores.find(e => e.campo === 'correo')?.mensaje}
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