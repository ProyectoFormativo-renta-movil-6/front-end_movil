/**
 * RF50 — Editar información del usuario
 * Componente que muestra la información actual del usuario
 */
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UsuarioPerfil } from "../types/perfil.types";

interface Props {
  usuario: UsuarioPerfil;
  onEditar: () => void;
  onCambiarCorreo: () => void;
}

export function InfoPersonal({ usuario, onEditar, onCambiarCorreo }: Props) {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
          </Text>
        </View>
        <Text style={styles.nombreCompleto}>
          {usuario.nombre} {usuario.apellido}
        </Text>
        <Text style={styles.correoAvatar}>{usuario.correo}</Text>
      </View>

      {/* Datos personales */}
      <View style={styles.seccion}>
        <Text style={styles.seccionLabel}>DATOS PERSONALES</Text>

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Nombre</Text>
          <Text style={styles.campoValor}>{usuario.nombre}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Apellido</Text>
          <Text style={styles.campoValor}>{usuario.apellido}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Cédula</Text>
          <Text style={styles.campoValor}>{usuario.cedula}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Teléfono</Text>
          <Text style={styles.campoValor}>{usuario.telefono}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Fecha de nacimiento</Text>
          <Text style={styles.campoValor}>{usuario.fechaNacimiento}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Nacionalidad</Text>
          <Text style={styles.campoValor}>{usuario.nacionalidad}</Text>
        </View>
      </View>

      {/* Correo con botón cambiar */}
      <View style={styles.seccion}>
        <Text style={styles.seccionLabel}>CORREO ELECTRÓNICO</Text>
        <View style={styles.correoRow}>
          <View style={styles.correoInfo}>
            <Text style={styles.campoLabel}>Correo actual</Text>
            <Text style={styles.campoValor}>{usuario.correo}</Text>
          </View>
          <TouchableOpacity
            style={styles.btnCambiarCorreo}
            onPress={onCambiarCorreo}
          >
            <Text style={styles.btnCambiarCorreoText}>Cambiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón editar */}
      <TouchableOpacity style={styles.btnEditar} onPress={onEditar}>
        <Text style={styles.btnEditarText}>✏️  Editar información</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  avatarWrap: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  nombreCompleto: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  correoAvatar: {
    fontSize: 13,
    color: "#6B7280",
  },
  seccion: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    marginBottom: 16,
  },
  seccionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D4ED8",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  campo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  campoLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  campoValor: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  correoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  correoInfo: { flex: 1 },
  btnCambiarCorreo: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1D4ED8",
  },
  btnCambiarCorreoText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  btnEditar: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  btnEditarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});