import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { primaryButtonStyles as styles } from './PrimaryButton.styles';

interface Props {
  titulo: string;
  onPress: () => void;
  cargando?: boolean;
  deshabilitado?: boolean;
  variante?: 'primario' | 'secundario' | 'texto';
}

export function PrimaryButton({
  titulo,
  onPress,
  cargando = false,
  deshabilitado = false,
  variante = 'primario',
}: Props) {
  const estaDeshabilitado = deshabilitado || cargando;

  return (
    <TouchableOpacity
      style={[
        styles.boton,
        variante === 'secundario' && styles.botonSecundario,
        variante === 'texto' && styles.botonTexto,
        estaDeshabilitado && styles.botonDeshabilitado,
      ]}
      onPress={onPress}
      disabled={estaDeshabilitado}
      activeOpacity={0.75}
    >
      {cargando ? (
        <ActivityIndicator
          size="small"
          color={variante === 'primario' ? '#FFFFFF' : '#1D4ED8'}
        />
      ) : (
        <Text
          style={[
            styles.texto,
            variante === 'secundario' && styles.textoSecundario,
            variante === 'texto' && styles.textoEnlace,
          ]}
        >
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}
