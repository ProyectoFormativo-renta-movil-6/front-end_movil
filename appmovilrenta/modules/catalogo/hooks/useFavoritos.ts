// modules/catalogo/hooks/useFavoritos.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const CLAVE_BASE = "favoritosVehiculos";

export function useFavoritos(usuarioId: string | null) {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);

  const clave = usuarioId ? `${CLAVE_BASE}_${usuarioId}` : null;

  // Carga favoritos del storage al montar
  useEffect(() => {
    if (!clave) {
      setFavoritos([]);
      return;
    }

    const cargar = async () => {
      setCargando(true);
      try {
        const guardados = await AsyncStorage.getItem(clave);
        if (guardados) {
          setFavoritos(JSON.parse(guardados));
        } else {
          setFavoritos([]);
        }
      } catch (error) {
        console.error("Error cargando favoritos:", error);
        setFavoritos([]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [clave]);

  const toggleFavorito = useCallback(
    async (vehiculoId: string) => {
      if (!clave) return;

      const nuevosFavoritos = favoritos.includes(vehiculoId)
        ? favoritos.filter((id) => id !== vehiculoId)
        : [...favoritos, vehiculoId];

      setFavoritos(nuevosFavoritos);

      try {
        await AsyncStorage.setItem(clave, JSON.stringify(nuevosFavoritos));
      } catch (error) {
        console.error("Error guardando favoritos:", error);
        // Revertir si falla el guardado
        setFavoritos(favoritos);
      }
    },
    [clave, favoritos],
  );

  const esFavorito = useCallback(
    (vehiculoId: string): boolean => {
      return favoritos.includes(vehiculoId);
    },
    [favoritos],
  );

  return { favoritos, toggleFavorito, esFavorito, cargando };
}
