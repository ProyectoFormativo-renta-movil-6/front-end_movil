// app/(tabs)/busqueda.tsx

import BuscadorCatalogo from "@/modules/catalogo/components/BuscadorCatalogo";
import { COLORES } from "@/modules/catalogo/constants/catalogo.constants";
import { useCatalogo } from "@/modules/catalogo/hooks/useCatalogo";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function BusquedaScreen() {
  const usuario = useAuthStore((state) => state.usuario);
  const invitado = !usuario;

  // useFocusEffect asegura que la redirección ocurra inmediatamente el usuario pise la pestaña
  useFocusEffect(
    useCallback(() => {
      if (invitado) {
        // Redirige directamente al catálogo de manera limpia sin dejar historial intermedio
        router.replace("/catalogo");
      }
    }, [invitado]),
  );

  // Estados mínimos requeridos para evitar errores de renderizado en el buscador
  const [textBusqueda, setTextBusqueda] = useState("");
  const [modalFormVisible, setModalFormVisible] = useState(false);
  const { busquedaForm, setForm, handleBuscar, errorBusqueda } = useCatalogo();

  // SI ES INVITADO: Retorna vacío inmediatamente para que no se renderice ni el Buscador ni sus modales
  if (invitado) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerUsuario}>
          <Ionicons name="person-circle-outline" size={28} color="#2f4ea2" />
          <Text style={styles.headerUsuarioNombre} numberOfLines={1}>
            {usuario?.nombres ?? "Usuario"}
          </Text>
        </View>
      </View>

      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>BIENVENIDO</Text>
        <Text style={styles.heroTitle}>¿A dónde quieres{"\n"}ir hoy?</Text>
        <Text style={styles.heroSub}>
          Encuentra el vehículo perfecto para tu viaje
        </Text>
      </View>

      {/* BUSCADOR */}
      <View style={styles.buscadorWrap}>
        <BuscadorCatalogo
          form={busquedaForm}
          setForm={setForm}
          textBusqueda={textBusqueda}
          setTextBusqueda={setTextBusqueda}
          onBuscar={handleBuscar}
          errorBusqueda={errorBusqueda}
          disabled={false}
          modalFormVisible={modalFormVisible}
          setModalFormVisible={setModalFormVisible}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  logo: {
    width: 110,
    height: 32,
  },
  headerUsuario: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerUsuarioNombre: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2f4ea2",
    maxWidth: 120,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    backgroundColor: "#fff",
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2f4ea2",
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f172a",
    lineHeight: 36,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: COLORES.textSecondary,
    fontWeight: "500",
  },
  buscadorWrap: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORES.panelBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});
