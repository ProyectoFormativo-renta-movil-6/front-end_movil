import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Pantalla temporal del catálogo — se reemplaza en el Módulo 2
export default function CatalogoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.marca}>🚗 Renta Móvil</Text>
        <Text style={styles.titulo}>Catálogo de vehículos</Text>
        <Text style={styles.subtitulo}>Módulo 2 — próximamente</Text>
      </View>

      {/* Tarjetas placeholder */}
      {[1, 2, 3].map(n => (
        <View key={n} style={styles.tarjetaPlaceholder}>
          <Text style={styles.tarjetaIcono}>🚙</Text>
          <View style={styles.tarjetaInfo}>
            <Text style={styles.tarjetaNombre}>Vehículo #{n}</Text>
            <Text style={styles.tarjetaDetalle}>Disponible · Desde $80.000/día</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  encabezado: {
    marginBottom: 28,
  },
  marca: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6B7280',
  },
  tarjetaPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tarjetaIcono: {
    fontSize: 40,
  },
  tarjetaInfo: {
    flex: 1,
  },
  tarjetaNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  tarjetaDetalle: {
    fontSize: 13,
    color: '#6B7280',
  },
});
