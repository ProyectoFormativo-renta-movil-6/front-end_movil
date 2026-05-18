import { Redirect } from "expo-router";
import { useOnboarding } from "@/modules/onboarding/hooks/use-onboarding";

export default function Index() {
  const { hasCompletedOnboarding, _hasHydrated } = useOnboarding();

  // Espera que Zustand termine de leer AsyncStorage antes de redirigir
  if (!_hasHydrated) return null;

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}
