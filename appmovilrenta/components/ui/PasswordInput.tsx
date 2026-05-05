import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { passwordInputStyles as styles } from './PasswordInput.styles';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function PasswordInput({ label, error, ...props }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.fila, error ? styles.filaError : undefined]}>
        <TextInput
          style={styles.input}
          secureTextEntry={!visible}
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
          autoCapitalize="none"
          {...props}
        />
        <TouchableOpacity
          onPress={() => setVisible(v => !v)}
          style={styles.botonOjo}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.textoOjo}>{visible ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.textoError}>{error}</Text> : null}
    </View>
  );
}
