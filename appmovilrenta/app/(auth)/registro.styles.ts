import { StyleSheet } from 'react-native';

export const registroStyles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contenedor: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 48,
  },

  // ── Encabezado ──────────────────────────────────────────────
  encabezado: {
    marginBottom: 28,
  },
  marca: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6B7280',
  },

  // ── Secciones ───────────────────────────────────────────────
  seccionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
    marginTop: 8,
  },
  seccionHint: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 14,
    marginTop: -8,
    lineHeight: 18,
  },

  // ── Términos y condiciones ───────────────────────────────────
  filaTerminos: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxActivo: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  textoTerminos: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  enlaceTerminos: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  errorTerminos: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },

  // ── Pie del formulario ───────────────────────────────────────
  pieFormulario: {
    marginTop: 20,
  },

  // ── Pantalla de éxito ────────────────────────────────────────
  contenedorExito: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconoExito: {
    fontSize: 72,
    marginBottom: 20,
  },
  tituloExito: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  mensajeExito: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
