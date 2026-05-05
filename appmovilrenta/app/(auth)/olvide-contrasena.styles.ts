import { StyleSheet } from 'react-native';

export const olvideStyles = StyleSheet.create({
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
  botonVolver: {
    alignSelf: 'flex-start',
    marginBottom: 32,
    paddingVertical: 4,
  },
  textoVolver: {
    color: '#1D4ED8',
    fontSize: 15,
    fontWeight: '600',
  },
  icono: {
    fontSize: 52,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 22,
  },
  contenedorExito: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoExito: {
    fontSize: 64,
    marginBottom: 20,
  },
  tituloExito: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  mensajeExito: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  enlaceRegistro: {
    marginTop: 12,
    paddingVertical: 4,
  },
  textoEnlaceRegistro: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});