import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.texto}>Modal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  texto: {
    fontSize: 18,
    color: '#111827',
  },
});
