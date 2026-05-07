import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useRegistro } from '@/modules/auth/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { registroStyles as styles } from './_registro.styles';

export default function RegistroScreen() {
  const {
    form,
    cargando,
    actualizarCampo,
    registrar,
    getError,
  } = useRegistro();

  const [modalTerminos, setModalTerminos] = useState(false);

  function handleRegistrar() {
    registrar(
      () => {
        Alert.alert(
          '✅ Registro exitoso',
          'Tu cuenta fue creada correctamente.',
          [{ text: 'Ir al login', onPress: () => router.replace('/(auth)/login') }]
        );
      },
      () => {
        Alert.alert(
          '❌ Registro fallido',
          'Por favor revisa los campos marcados en rojo e intenta de nuevo.',
          [{ text: 'Entendido' }]
        );
      }
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
        {/* ── Botón volver ───────────────────────────────────── */}
        <TouchableOpacity onPress={() => router.back()} style={styles.botonVolver}>
          <Text style={styles.textoVolver}>← Volver</Text>
        </TouchableOpacity>

        {/* ── Encabezado ─────────────────────────────────────── */}
        <View style={styles.encabezado}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.titulo}>Crear cuenta</Text>
        </View>

        {/* ── Datos personales ───────────────────────────────── */}
        <Text style={styles.seccionLabel}>Datos personales</Text>

        <InputField
          label="Nombre completo *"
          placeholder="Ej: Laura Vanessa Pérez Perdomo"
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
          placeholder="Entre 6 y 10 dígitos"
          keyboardType="numeric"
          value={form.numeroDocumento}
          onChangeText={val => actualizarCampo('numeroDocumento', val)}
          error={getError('numeroDocumento')}
        />
        <InputField
          label="Número celular *"
          placeholder="3001234567 (10 dígitos, empieza con 3)"
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

        {/* ── Correo ─────────────────────────────────────────── */}
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

        {/* ── Contraseña ─────────────────────────────────────── */}
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
        <View style={styles.filaTerminos}>
          <TouchableOpacity
            onPress={() => actualizarCampo('aceptaTerminos', !form.aceptaTerminos)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, form.aceptaTerminos && styles.checkboxActivo]}>
              {form.aceptaTerminos ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
          </TouchableOpacity>
          <Text style={styles.textoTerminos}>
            Acepto los{' '}
            <Text
              style={styles.enlaceTerminos}
              onPress={() => setModalTerminos(true)}
            >
              términos y condiciones
            </Text>
            {' '}del servicio
          </Text>
        </View>
        {getError('aceptaTerminos') ? (
          <Text style={styles.errorTerminos}>{getError('aceptaTerminos')}</Text>
        ) : null}

        {/* ── Botón ──────────────────────────────────────────── */}
        <View style={styles.pieFormulario}>
          <PrimaryButton
            titulo="Crear mi cuenta"
            onPress={handleRegistrar}
            cargando={cargando}
          />
        </View>
      </ScrollView>

      {/* ── Modal: Términos y condiciones ──────────────────────── */}
      <Modal visible={modalTerminos} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContenedor}>
            <View style={styles.modalHandle} />
            <View style={styles.modalEncabezado}>
              <Text style={styles.modalTitulo}>Términos y condiciones</Text>
              <TouchableOpacity
                style={styles.modalBotonCerrar}
                onPress={() => setModalTerminos(false)}
              >
                <Text style={styles.modalBotonCerrarTexto}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSeccionTitulo}>1. Objeto del servicio</Text>
              <Text style={styles.modalTexto}>
                Renta Móvil Location presta el servicio de arrendamiento de vehículos a personas naturales mayores de 18 años, con documento de identidad válido y licencia de conducción vigente.
              </Text>
              <Text style={styles.modalSeccionTitulo}>2. Requisitos del arrendatario</Text>
              <Text style={styles.modalTexto}>
                El usuario debe presentar documento de identidad original, licencia de conducción válida y una tarjeta de crédito o débito a su nombre. No se permite el subarrendamiento del vehículo a terceros.
              </Text>
              <Text style={styles.modalSeccionTitulo}>3. Condiciones de uso del vehículo</Text>
              <Text style={styles.modalTexto}>
                El vehículo debe ser utilizado únicamente en el territorio nacional, respetando las normas de tránsito vigentes. Queda prohibido conducir bajo efectos de alcohol o sustancias psicoactivas.
              </Text>
              <Text style={styles.modalSeccionTitulo}>4. Responsabilidad por daños</Text>
              <Text style={styles.modalTexto}>
                El arrendatario es responsable de cualquier daño, multa o infracción ocurrida durante el periodo de alquiler. Los daños deben reportarse de inmediato a Renta Móvil Location.
              </Text>
              <Text style={styles.modalSeccionTitulo}>5. Cancelaciones</Text>
              <Text style={styles.modalTexto}>
                Las reservas confirmadas y pagadas no son reembolsables. Renta Móvil Location se reserva el derecho de cancelar una reserva por causas de fuerza mayor, en cuyo caso se ofrecerá una fecha alternativa al usuario.
              </Text>
              <Text style={styles.modalSeccionTitulo}>6. Pagos</Text>
              <Text style={styles.modalTexto}>
                Los pagos se procesan a través de la pasarela Wompi. Todas las transacciones quedan registradas y son auditables. Renta Móvil Location no almacena datos bancarios del usuario.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalBotonAceptar}
              onPress={() => setModalTerminos(false)}
            >
              <Text style={styles.modalBotonAceptarTexto}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}