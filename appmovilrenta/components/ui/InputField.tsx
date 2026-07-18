import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { inputFieldStyles as styles } from './InputField.styles';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function InputField({ label, error, ...props }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        {...props}
      />
      {error ? <Text style={styles.textoError}>{error}</Text> : null}
    </View>
  );
}
