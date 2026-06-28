import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screen2Styles as styles } from "./_screen2.styles";

export default function OnboardingScreen2() {
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
    <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
      {/* Hero mapa */}
      <Animated.View style={[styles.heroWrap, { opacity: fadeAnim }]}>
        <View style={styles.mapCard}>
          <View style={styles.mapBg}>
            {/* Calles */}
            <View style={styles.streetH1} />
            <View style={styles.streetH2} />
            <View style={styles.streetV1} />
            <View style={styles.streetV2} />
            {/* Pin */}
            <View style={styles.pinWrap}>
              <View style={styles.pin}>
                <Text style={{ fontSize: 16, color: "#fff" }}>📍</Text>
              </View>
            </View>
            {/* Carros */}
            <View style={[styles.carDot, { top: 55, left: 45 }]}>
              <Text style={{ fontSize: 20 }}>🚗</Text>
            </View>
            <View style={[styles.carDot, { top: 95, right: 35 }]}>
              <Text style={{ fontSize: 20 }}>🚙</Text>
            </View>
            <View style={[styles.carDot, { bottom: 55, left: 75 }]}>
              <Text style={{ fontSize: 20 }}>🚘</Text>
            </View>
          </View>

          {/* Card reserva flotante */}
          <View style={styles.reservaOverlay}>
            <Text style={styles.reservaTitle}>Reserva</Text>
            <View style={styles.reservaRow}>
              <Text style={styles.reservaIcon}>📍</Text>
              <Text style={styles.reservaText}>Neiva — Centro</Text>
            </View>
            <View style={styles.reservaRow}>
              <Text style={styles.reservaIcon}>📅</Text>
              <Text style={styles.reservaText}>15 Jun · 09:00 — 19:00</Text>
            </View>
            <View style={styles.reservaBtn}>
              <Text style={styles.reservaBtnText}>Siguiente →</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Texto */}
      <Animated.View
        style={[
          styles.textWrap,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>Alquila Fácil</Text>
        <Text style={styles.subtitle}>
          Encuentra, selecciona y reserva el vehículo perfecto para tu viaje
          de forma rápida y sencilla.
        </Text>
      </Animated.View>
    </View>
  );
}