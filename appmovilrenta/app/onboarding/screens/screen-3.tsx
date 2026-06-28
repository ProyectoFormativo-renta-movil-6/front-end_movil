import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screen3Styles as styles } from "./_screen3.styles";

const PASOS = [
  { num: "1", icon: "🔍", titulo: "Busca",   desc: "Filtra por categoría, fecha y ciudad" },
  { num: "2", icon: "📅", titulo: "Reserva", desc: "Elige fechas y confirma en segundos" },
  { num: "3", icon: "🔑", titulo: "Conduce", desc: "Recibe tu contrato digital y maneja" },
];

export default function OnboardingScreen3() {
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
          <Text style={styles.heroEmoji}>⚡</Text>
        </View>
      </Animated.View>

      {/* Título */}
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: "center" }}
      >
        <Text style={styles.title}>Así de simple</Text>
        <Text style={styles.subtitle}>3 pasos y ya estás conduciendo</Text>
      </Animated.View>

      {/* Pasos */}
      <Animated.View
        style={[styles.pasosWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {PASOS.map((paso, i) => (
          <View key={paso.num}>
            <View style={styles.pasoRow}>
              <View style={styles.pasoLeft}>
                <View style={styles.pasoNum}>
                  <Text style={styles.pasoNumText}>{paso.num}</Text>
                </View>
                {i < PASOS.length - 1 && <View style={styles.pasoLinea} />}
              </View>
              <View style={styles.pasoCard}>
                <Text style={styles.pasoIcon}>{paso.icon}</Text>
                <View style={styles.pasoTextos}>
                  <Text style={styles.pasoTitulo}>{paso.titulo}</Text>
                  <Text style={styles.pasoDesc}>{paso.desc}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Stats */}
      <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
        {[
          { val: "500+", lbl: "Vehículos" },
          { val: "4.9★", lbl: "Calificación" },
          { val: "24/7", lbl: "Soporte" },
        ].map((s) => (
          <View key={s.lbl} style={styles.statCell}>
            <Text style={styles.statVal}>{s.val}</Text>
            <Text style={styles.statLbl}>{s.lbl}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}