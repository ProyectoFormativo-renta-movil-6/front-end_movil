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
import { useTranslation } from 'react-i18next';
import { useTemaColores } from '@/modules/i18n/hooks/useIdioma';
import { useRegistro } from '@/modules/auth/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { registroStyles as styles } from './_registro.styles';

export default function RegistroScreen() {
  const { t } = useTranslation();
  const c = useTemaColores();
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
          t('auth.registro.exitoTitulo'),
          t('auth.registro.exitoMsg'),
          [{ text: t('auth.registro.exitoBtn'), onPress: () => router.replace('/(auth)/login') }]
        );
      },
      () => {
        Alert.alert(
          t('auth.registro.errorTitulo'),
          t('auth.registro.errorMsg'),
          [{ text: t('auth.registro.errorBtn') }]
        );
      }
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: c.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenedor}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Botón volver ───────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace("/(auth)/login")}
          style={styles.botonVolver}
        >
          <Text style={styles.textoVolver}>{t('auth.registro.volver')}</Text>
        </TouchableOpacity>

        {/* ── Encabezado ─────────────────────────────────────── */}
        <View style={styles.encabezado}>
          <View style={[styles.logoWrapper, { backgroundColor: c.primaryBg }]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />
          </View>
          <Text style={[styles.titulo, { color: c.textPrimary }]}>{t('auth.registro.titulo')}</Text>
        </View>

        {/* ── Datos personales ───────────────────────────────── */}
        <Text style={styles.seccionLabel}>{t('auth.registro.datosPersonales')}</Text>

        <InputField
          label={t('auth.registro.nombre')}
          placeholder="Ej: Laura Vanessa Pérez Perdomo"
          autoCapitalize="words"
          value={form.nombreCompleto}
          onChangeText={val => actualizarCampo('nombreCompleto', val)}
          error={getError('nombreCompleto')}
        />
        <InputField
          label={t('auth.registro.nacionalidad')}
          placeholder="Ej: Colombiana"
          autoCapitalize="words"
          value={form.nacionalidad}
          onChangeText={val => actualizarCampo('nacionalidad', val)}
          error={getError('nacionalidad')}
        />
        <InputField
          label={t('auth.registro.documento')}
          placeholder="Entre 6 y 10 dígitos"
          keyboardType="numeric"
          value={form.numeroDocumento}
          onChangeText={val => actualizarCampo('numeroDocumento', val)}
          error={getError('numeroDocumento')}
        />
        <InputField
          label={t('auth.registro.celular')}
          placeholder="3001234567 (10 dígitos, empieza con 3)"
          keyboardType="phone-pad"
          value={form.numeroCelular}
          onChangeText={val => actualizarCampo('numeroCelular', val)}
          error={getError('numeroCelular')}
        />
        <InputField
          label={t('auth.registro.fechaNac')}
          placeholder="YYYY-MM-DD  (ej: 1995-06-15)"
          value={form.fechaNacimiento}
          onChangeText={val => actualizarCampo('fechaNacimiento', val)}
          error={getError('fechaNacimiento')}
        />

        {/* ── Correo ─────────────────────────────────────────── */}
        <Text style={styles.seccionLabel}>{t('auth.registro.correoSection')}</Text>

        <InputField
          label={t('auth.registro.correo')}
          placeholder="ejemplo@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.correo}
          onChangeText={val => actualizarCampo('correo', val)}
          error={getError('correo')}
        />
        <InputField
          label={t('auth.registro.confirmarCorreo')}
          placeholder="Repite tu correo"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.confirmarCorreo}
          onChangeText={val => actualizarCampo('confirmarCorreo', val)}
          error={getError('confirmarCorreo')}
        />

        {/* ── Contraseña ─────────────────────────────────────── */}
        <Text style={styles.seccionLabel}>{t('auth.registro.contrasenaSection')}</Text>
        <Text style={styles.seccionHint}>{t('auth.registro.contrasenaHint')}</Text>

        <PasswordInput
          label={t('auth.registro.contrasena')}
          placeholder="Crea tu contraseña"
          value={form.contrasena}
          onChangeText={val => actualizarCampo('contrasena', val)}
          error={getError('contrasena')}
        />
        <PasswordInput
          label={t('auth.registro.confirmarContrasena')}
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
            {t('auth.registro.terminosAcepto')}{' '}
            <Text
              style={styles.enlaceTerminos}
              onPress={() => setModalTerminos(true)}
            >
              {t('auth.registro.terminosLink')}
            </Text>
            {' '}{t('auth.registro.terminosDel')}
          </Text>
        </View>
        {getError('aceptaTerminos') ? (
          <Text style={styles.errorTerminos}>{getError('aceptaTerminos')}</Text>
        ) : null}

        {/* ── Botón ──────────────────────────────────────────── */}
        <View style={styles.pieFormulario}>
          <PrimaryButton
            titulo={t('auth.registro.btnCrear')}
            onPress={handleRegistrar}
            cargando={cargando}
          />
        </View>
      </ScrollView>

      {/* ── Modal: Términos y condiciones ──────────────────────── */}
      <Modal visible={modalTerminos} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContenedor, { backgroundColor: c.bgCard }]}>
            <View style={[styles.modalHandle, { backgroundColor: c.border }]} />
            <View style={styles.modalEncabezado}>
              <Text style={[styles.modalTitulo, { color: c.textPrimary }]}>{t('auth.registro.modalTitulo')}</Text>
              <TouchableOpacity
                style={styles.modalBotonCerrar}
                onPress={() => setModalTerminos(false)}
              >
                <Text style={styles.modalBotonCerrarTexto}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSeccionTitulo}>{t('auth.registro.tc1Titulo')}</Text>
              <Text style={styles.modalTexto}>{t('auth.registro.tc1Texto')}</Text>
              <Text style={styles.modalSeccionTitulo}>{t('auth.registro.tc2Titulo')}</Text>
              <Text style={styles.modalTexto}>{t('auth.registro.tc2Texto')}</Text>
              <Text style={styles.modalSeccionTitulo}>{t('auth.registro.tc3Titulo')}</Text>
              <Text style={styles.modalTexto}>{t('auth.registro.tc3Texto')}</Text>
              <Text style={styles.modalSeccionTitulo}>{t('auth.registro.tc4Titulo')}</Text>
              <Text style={styles.modalTexto}>{t('auth.registro.tc4Texto')}</Text>
              <Text style={styles.modalSeccionTitulo}>{t('auth.registro.tc5Titulo')}</Text>
              <Text style={styles.modalTexto}>{t('auth.registro.tc5Texto')}</Text>
              <Text style={styles.modalSeccionTitulo}>{t('auth.registro.tc6Titulo')}</Text>
              <Text style={styles.modalTexto}>{t('auth.registro.tc6Texto')}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalBotonAceptar}
              onPress={() => setModalTerminos(false)}
            >
              <Text style={styles.modalBotonAceptarTexto}>{t('auth.registro.modalAceptar')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}