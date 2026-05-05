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
import { useRegistro } from '@/modules/auth/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { registroStyles as styles } from './_registro.styles';

export default function RegistroScreen() {
  const { form, cargando, actualizarCampo, registrar, getError } = useRegistro();

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
        {/* ── Botón volver ───────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.botonVolver}
        >
          <Text style={styles.textoVolver}>← Volver</Text>
        </TouchableOpacity>

        {/* ── Encabezado ─────────────────────────────────────── */}
        <View style={styles.encabezado}>
          <Text style={styles.marca}>🚗 Renta Móvil</Text>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Completa tus datos para registrarte</Text>
        </View>

        {/* ── Sección: Datos personales ──────────────────────── */}
        <Text style={styles.seccionLabel}>Datos personales</Text>

        <InputField
          label="Nombre completo *"
          placeholder="Tu nombre y apellidos"
          autoCapitalize="words"
          value={form.nombreCompleto}
          onChangeText={val => actualizarCampo('nombreCompleto', val)}
          error={getError('nombreCompleto')}
        />

        <InputField
          label="Nacionalidad *"
          placeholder="Ej: Colombiana"
          autoCapitalize="words"
          value={form.nacionalidad}
          onChangeText={val => actualizarCampo('nacionalidad', val)}
          error={getError('nacionalidad')}
        />

        <InputField
          label="Número de documento *"
          placeholder="Cédula o pasaporte"
          keyboardType="numeric"
          value={form.numeroDocumento}
          onChangeText={val => actualizarCampo('numeroDocumento', val)}
          error={getError('numeroDocumento')}
        />

        <InputField
          label="Número celular *"
          placeholder="3001234567 (10 dígitos)"
          keyboardType="phone-pad"
          value={form.numeroCelular}
          onChangeText={val => actualizarCampo('numeroCelular', val)}
          error={getError('numeroCelular')}
        />

        <InputField
          label="Fecha de nacimiento *"
          placeholder="YYYY-MM-DD  (ej: 1995-06-15)"
          value={form.fechaNacimiento}
          onChangeText={val => actualizarCampo('fechaNacimiento', val)}
          error={getError('fechaNacimiento')}
        />

        {/* ── Sección: Correo ────────────────────────────────── */}
        <Text style={styles.seccionLabel}>Correo electrónico</Text>

        <InputField
          label="Correo *"
          placeholder="ejemplo@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.correo}
          onChangeText={val => actualizarCampo('correo', val)}
          error={getError('correo')}
        />

        <InputField
          label="Confirmar correo *"
          placeholder="Repite tu correo"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.confirmarCorreo}
          onChangeText={val => actualizarCampo('confirmarCorreo', val)}
          error={getError('confirmarCorreo')}
        />

        {/* ── Sección: Contraseña ────────────────────────────── */}
        <Text style={styles.seccionLabel}>Contraseña</Text>
        <Text style={styles.seccionHint}>
          Mínimo 8 caracteres · 1 mayúscula · 1 minúscula · 1 número · 1 símbolo (@$!%*?&)
        </Text>

        <PasswordInput
          label="Contraseña *"
          placeholder="Crea tu contraseña"
          value={form.contrasena}
          onChangeText={val => actualizarCampo('contrasena', val)}
          error={getError('contrasena')}
        />

        <PasswordInput
          label="Confirmar contraseña *"
          placeholder="Repite tu contraseña"
          value={form.confirmarContrasena}
          onChangeText={val => actualizarCampo('confirmarContrasena', val)}
          error={getError('confirmarContrasena')}
        />

        {/* ── Términos y condiciones ─────────────────────────── */}
        <TouchableOpacity
          style={styles.filaTerminos}
          onPress={() => actualizarCampo('aceptaTerminos', !form.aceptaTerminos)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, form.aceptaTerminos && styles.checkboxActivo]}>
            {form.aceptaTerminos ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.textoTerminos}>
            Acepto los{' '}
            <Text style={styles.enlaceTerminos}>términos y condiciones</Text>
            {' '}del servicio
          </Text>
        </TouchableOpacity>
        {getError('aceptaTerminos') ? (
          <Text style={styles.errorTerminos}>{getError('aceptaTerminos')}</Text>
        ) : null}

        {/* ── Botón principal ────────────────────────────────── */}
        <View style={styles.pieFormulario}>
          <PrimaryButton
            titulo="Crear mi cuenta"
            onPress={() => registrar(() => router.replace('/(auth)/login'))}
            cargando={cargando}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}