import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

// Pantalla temporal de exploración — se reemplaza en módulos siguientes
export default function ExplorarScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>🔍 Explorar</Text>
      <Text style={styles.subtitulo}>Próximamente: filtros avanzados y mapa de sucursales.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
