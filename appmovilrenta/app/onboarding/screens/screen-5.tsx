import { useOnboarding } from "@/hooks/use-onboarding";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screen5Styles as styles } from "./_screen5.styles";

const BENEFICIOS = [
  { icon: "✅", txt: "Acceso a todas las funcionalidades" },
  { icon: "🎁", txt: "Ofertas exclusivas para miembros" },
  { icon: "📞", txt: "Soporte 24/7 disponible" },
];

export default function OnboardingScreen5() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useOnboarding();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 55,
        friction: 9,
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

  const handleRegistro = () => {
    completeOnboarding();
    router.replace("/(auth)/registro");
  };

  const handleLogin = () => {
    completeOnboarding();
    router.replace("/(auth)/login");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity: fadeAnim }]}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Check animado */}
      <Animated.View
        style={[
          styles.successWrap,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.successOuter}>
          <View style={styles.successInner}>
            <Text style={styles.successCheck}>✓</Text>
          </View>
        </View>
        <View style={styles.ring1} />
        <View style={styles.ring2} />
      </Animated.View>

      {/* Título */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Conduce Libre</Text>
        <Text style={styles.subtitle}>
          Olvídate de papeleos complicados y disfruta tu viaje con total
          libertad y flexibilidad.
        </Text>
      </Animated.View>

      {/* Beneficios */}
      <Animated.View
        style={[
          styles.benefitsCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {BENEFICIOS.map((b) => (
          <View key={b.txt} style={styles.benefitRow}>
            <Text style={styles.benefitIcon}>{b.icon}</Text>
            <Text style={styles.benefitText}>{b.txt}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Botones CTA */}
      <Animated.View style={[styles.ctaWrap, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.ctaBtnPrimary}
          onPress={handleRegistro}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnPrimaryText}>REGÍSTRATE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctaBtnText} onPress={handleLogin}>
          <Text style={styles.ctaBtnTextNormal}>
            Ya tengo cuenta ·{" "}
            <Text style={styles.ctaBtnTextLink}>Iniciar Sesión</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
