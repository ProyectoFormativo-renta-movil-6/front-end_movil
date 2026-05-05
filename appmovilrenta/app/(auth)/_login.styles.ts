import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contenedor: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  encabezado: {
    alignItems: 'center',
    marginBottom: 36,
  },
  marca: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  bannerError: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  bannerErrorTexto: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  formulario: {
    marginBottom: 8,
  },
  enlaceOlvide: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 4,
    paddingVertical: 4,
  },
  textoEnlace: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '600',
  },
  acciones: {
    marginTop: 8,
  },
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  lineaSeparador: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  textoSeparador: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
});