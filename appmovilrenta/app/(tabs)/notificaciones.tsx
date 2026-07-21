import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTemaColores } from '@/modules/i18n/hooks/useIdioma';

export default function BuscarScreen() {
  const insets = useSafeAreaInsets();
  const c = useTemaColores();
  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.textSecondary }]}>Notificaciones — próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16 },
});
