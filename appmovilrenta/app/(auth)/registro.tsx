import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTemaColores } from '@/modules/i18n/hooks/useIdioma';
import { useRegistro } from '@/modules/auth/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SocialAuthButtons } from '@/modules/auth/components/SocialAuthButtons';
import { PasswordRequirements } from '@/modules/auth/components/PasswordRequirements';
import { registroStyles as styles } from '@/modules/auth/styles/registro.styles';

export default function RegistroScreen() {
  const { t } = useTranslation();
  const c = useTemaColores();
  const insets = useSafeAreaInsets();
  const {
    form,
    cargando,
    actualizarCampo,
    registrar,
    getError,
  } = useRegistro();

  const [modalTerminos, setModalTerminos] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [correoTocado, setCorreoTocado] = useState(false);

  const errorCorreo = getError('correo') ??
    (correoTocado && form.correo.length > 0 && !form.correo.includes('@')
      ? t('auth.registro.errorAt')
      : undefined);

  function handleRegistrar() {
    registrar(
      () => setRegistroExitoso(true),
      () => {}
    );
  }

  if (registroExitoso) {
    return (
      <View style={[styles.flex, { backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }]}>
        <View style={[exitoS.circulo, { backgroundColor: c.primaryBg }]}>
          <Text style={exitoS.check}>✓</Text>
        </View>
        <Text style={[exitoS.titulo, { color: c.textPrimary }]}>{t('auth.registro.exitoTitulo')}</Text>
        <Text style={[exitoS.msg, { color: c.textSecondary }]}>{t('auth.registro.exitoMsg')}</Text>
        <TouchableOpacity
          style={exitoS.btn}
          onPress={() => router.replace('/(auth)/login')}
          activeOpacity={0.85}
        >
          <Text style={exitoS.btnTexto}>{t('auth.registro.exitoBtn')} →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: '#1D4ED8' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Header azul ─────────────────────────────────────── */}
      <View style={[newS.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}
          style={newS.backBtn}
        >
          <Text style={newS.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={newS.titulo}>{t('auth.registro.titulo')}</Text>
        <Text style={newS.subtitulo}>{t('auth.registro.subtitulo')}</Text>
      </View>

      {/* ── Sheet blanca ────────────────────────────────────── */}
      <View style={[newS.sheet, { backgroundColor: c.bg }]}>
        <ScrollView
          contentContainerStyle={newS.sheetContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Correo */}
          <InputField
            label={t('auth.registro.correo')}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.correo}
            onChangeText={val => actualizarCampo('correo', val)}
            onBlur={() => setCorreoTocado(true)}
            error={errorCorreo}
          />

          {/* Contraseña */}
          <PasswordInput
            label={t('auth.registro.contrasena')}
            placeholder={t('auth.registro.contrasena')}
            value={form.contrasena}
            onChangeText={val => actualizarCampo('contrasena', val)}
            error={getError('contrasena')}
          />
          <PasswordRequirements password={form.contrasena} />
          <PasswordInput
            label={t('auth.registro.confirmarContrasena')}
            placeholder={t('auth.registro.confirmarContrasena')}
            value={form.confirmarContrasena}
            onChangeText={val => actualizarCampo('confirmarContrasena', val)}
            error={getError('confirmarContrasena')}
          />

          {/* Términos */}
          <View style={styles.filaTerminos}>
            <TouchableOpacity
              onPress={() => actualizarCampo('aceptaTerminos', !form.aceptaTerminos)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, form.aceptaTerminos && styles.checkboxActivo]}>
                {form.aceptaTerminos ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
            </TouchableOpacity>
            <Text style={[styles.textoTerminos, { color: c.textSecondary }]}>
              {t('auth.registro.terminosAcepto')}{' '}
              <Text style={styles.enlaceTerminos} onPress={() => setModalTerminos(true)}>
                {t('auth.registro.terminosLink')}
              </Text>
              {' '}{t('auth.registro.terminosDel')}
            </Text>
          </View>
          {getError('aceptaTerminos') ? (
            <Text style={styles.errorTerminos}>{getError('aceptaTerminos')}</Text>
          ) : null}

          {/* Botón */}
          <View style={styles.pieFormulario}>
            <PrimaryButton
              titulo={t('auth.registro.btnCrear')}
              onPress={handleRegistrar}
              cargando={cargando}
            />
            <SocialAuthButtons
              onGoogle={() => console.log('Google registro')}
              onFacebook={() => console.log('Facebook registro')}
            />
          </View>
        </ScrollView>
      </View>

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

const newS = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 48,
  },
});

const exitoS = StyleSheet.create({
  circulo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  check: {
    fontSize: 42,
    color: '#10B981',
    fontWeight: '800',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  msg: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  btn: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  btnTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});