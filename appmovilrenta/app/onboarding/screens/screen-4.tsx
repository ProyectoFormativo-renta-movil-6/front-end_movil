import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screen4Styles as styles } from "./_screen4.styles";

const METODOS = [
  { icon: "🏦", label: "PSE",     color: "#1D4ED8", active: true  },
  { icon: "💳", label: "Tarjeta", color: "#7C3AED", active: false },
  { icon: "📱", label: "Nequi",   color: "#BE185D", active: false },
  { icon: "💵", label: "Efecty",  color: "#D97706", active: false },
];

const SEGURIDAD = [
  { icon: "🛡️", texto: "Datos bancarios tokenizados con PCI DSS" },
  { icon: "🔐", texto: "Cifrado SSL/TLS en todas las transacciones" },
  { icon: "📄", texto: "Contrato digital generado automáticamente" },
];

export default function OnboardingScreen4() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32 }]}>
      {/* Hero */}
      <Animated.View style={[styles.heroWrap, { opacity: fadeAnim }]}>
        <View style={styles.heroCircle}>
          <Text style={styles.heroEmoji}>🔒</Text>
        </View>
        <View style={styles.wompiTag}>
          <Text style={styles.wompiText}>Powered by Wompi</Text>
        </View>
      </Animated.View>

      {/* Título */}
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: "center" }}
      >
        <Text style={styles.title}>Paga como prefieras</Text>
        <Text style={styles.subtitle}>Pagos 100% seguros con cifrado SSL.</Text>
      </Animated.View>

      {/* Métodos de pago */}
      <Animated.View
        style={[styles.metodos, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {METODOS.map((m) => (
          <View
            key={m.label}
            style={[styles.metodoCard, m.active && styles.metodoCardActive]}
          >
            <View style={[styles.metodoIconWrap, { backgroundColor: m.color + "18" }]}>
              <Text style={styles.metodoIcon}>{m.icon}</Text>
            </View>
            <Text style={[styles.metodoLabel, m.active && styles.metodoLabelActive]}>
              {m.label}
            </Text>
            {m.active && (
              <View style={styles.metodoCheck}>
                <Text style={{ fontSize: 10, color: "#fff" }}>✓</Text>
              </View>
            )}
          </View>
        ))}
      </Animated.View>

      {/* Garantías de seguridad */}
      <Animated.View style={[styles.seguridadCard, { opacity: fadeAnim }]}>
        {SEGURIDAD.map((item) => (
          <View key={item.texto} style={styles.seguridadRow}>
            <Text style={styles.seguridadIcon}>{item.icon}</Text>
            <Text style={styles.seguridadText}>{item.texto}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}