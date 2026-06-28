import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOnboarding } from "@/hooks/use-onboarding";

interface Props {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export default function OnboardingNavigation({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  onSkip,
}: Props) {
  const { completeOnboarding } = useOnboarding();
  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  const handleRegistro = () => {
    completeOnboarding();
    router.push("/(auth)/registro");
  };

  const handleLogin = () => {
    completeOnboarding();
    router.push("/(auth)/login");
  };

  if (isLast) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleRegistro}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>REGÍSTRATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnText} onPress={handleLogin}>
          <Text style={styles.btnTextText}>
            Ya tengo cuenta ·{" "}
            <Text style={styles.btnTextLink}>Iniciar Sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btnGhost}
          onPress={isFirst ? onSkip : onPrevious}
        >
          <Text style={styles.btnGhostText}>
            {isFirst ? "Saltar" : "← Atrás"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#1D4ED8",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  btnGhost: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },
  btnGhostText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  btnText: {
    alignItems: "center",
    paddingVertical: 10,
  },
  btnTextText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  btnTextLink: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
});