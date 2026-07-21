import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screen1Styles as styles } from "./_screen1.styles";

export default function OnboardingScreen1() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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
      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity: fadeAnim }]}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Hero */}
      <Animated.View
        style={[
          styles.heroWrap,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.heroCircle}>
          <Text style={styles.heroEmoji}>🔑</Text>
        </View>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>🇨🇴 Colombia</Text>
        </View>
      </Animated.View>

      {/* Texto */}
      <Animated.View
        style={[
          styles.textWrap,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>¡Bienvenido a{"\n"}Drivique!</Text>
        <Text style={styles.subtitle}>
          Tu libertad sobre ruedas comienza aquí.
        </Text>
        <Text style={styles.body}>
          Explora y reserva tu vehículo ideal en minutos.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
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
        </View>
      </Animated.View>
    </View>
  );
}
