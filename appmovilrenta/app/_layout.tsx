import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { I18nextProvider } from "react-i18next";
import i18n from "@/modules/i18n";
import { useIdioma } from "@/modules/i18n/hooks/useIdioma";

export default function RootLayout() {
  const { temaActual } = useIdioma();

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={temaActual === "oscuro" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>

        <StatusBar style={temaActual === "oscuro" ? "light" : "dark"} />
      </ThemeProvider>
    </I18nextProvider>
  );
}
