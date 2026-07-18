import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";
import { AlertModal } from "@/components/ui/AlertModal";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, focused }: { name: IoniconName; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as IoniconName)}
        size={22}
        color={focused ? "#2f4ea2" : "#9CA3AF"}
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const usuario = useAuthStore((s) => s.usuario);
  const [alertVisible, setAlertVisible] = useState(false);

  const tabBarHeight =
    Platform.OS === "android" ? 58 + insets.bottom : 60 + insets.bottom;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2f4ea2",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E5E7EB",
            borderTopWidth: 1,
            height: tabBarHeight,
            paddingBottom:
              Platform.OS === "android" ? insets.bottom + 4 : insets.bottom + 8,
            paddingTop: 6,
            elevation: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="catalogo"
          options={{
            title: "Inicio",
            tabBarIcon: ({ focused }) => <TabIcon name="car" focused={focused} />,
          }}
        />

        {/* Antes "Reservar" — ahora "Mis reservas": historial de reservas
            ya hechas. Siempre visible en la barra; si el invitado la toca,
            se intercepta la navegación y se muestra el AlertModal en vez
            de dejarlo entrar. */}
        <Tabs.Screen
          name="mis-reservas"
          options={{
            title: "Mis reservas",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="receipt" focused={focused} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              if (!usuario) {
                e.preventDefault();
                setAlertVisible(true);
              }
            },
          }}
        />

        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="person" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="buscar"
          options={{
            title: "Explorar",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="compass" focused={focused} />
            ),
          }}
        />

        {/* El flujo de reserva ya no vive en la barra de navegación — se
            llega a él desde el botón "Reservar ahora" de la tarjeta del
            catálogo (VehiculoCard -> router.push("/(tabs)/reservar")).
            La ruta sigue existiendo, solo se oculta del tab bar. */}
        <Tabs.Screen name="reservar" options={{ href: null }} />

        {/* Pantallas sin tab */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="busqueda" options={{ href: null }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
        <Tabs.Screen name="notificaciones" options={{ href: null }} />
      </Tabs>

      <AlertModal
        visible={alertVisible}
        icono="lock-closed-outline"
        titulo="Inicia sesión"
        mensaje="Necesitas una cuenta activa para ver tu historial de reservas."
        botones={[
          {
            texto: "Cancelar",
            variante: "secundario",
            onPress: () => setAlertVisible(false),
          },
          {
            texto: "Iniciar sesión",
            variante: "primario",
            onPress: () => {
              setAlertVisible(false);
              router.push("/(auth)/login");
            },
          },
        ]}
        onCerrar={() => setAlertVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "#EEF2FF",
  },
});