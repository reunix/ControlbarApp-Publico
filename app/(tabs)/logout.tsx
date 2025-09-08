import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEvento } from "@/constants/EventoContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";

export default function LogoutScreen() {
  const router = useRouter();
  const { setEventoSelecionado } = useEvento();
  const { clearCart } = useCart();

  const handleLogout = async () => {
    if (!router || !setEventoSelecionado || !clearCart) {
      console.error("LogoutScreen: Dependências não definidas", {
        router,
        setEventoSelecionado,
        clearCart,
      });
      return;
    }
    try {
      setEventoSelecionado(null);
      clearCart();
      router.replace("/login");
    } catch (error) {
      console.error("LogoutScreen: Erro ao realizar logout:", error);
    }
  };

  const handleCancel = () => {
    router.replace("/(tabs)");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Deseja sair deste evento?</ThemedText>
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.yesButton]}
          onPress={handleLogout}
        >
          <ThemedText style={styles.buttonText}>SIM</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.noButton]}
          onPress={handleCancel}
        >
          <ThemedText style={styles.buttonText}>NÃO</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    backgroundColor: Colors.dark.background,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 10,
  },
  yesButton: {
    backgroundColor: Colors.dark.tint,
  },
  noButton: {
    backgroundColor: Colors.dark.border,
  },
  buttonText: {
    color: Colors.dark.backgroundSecondary,
    fontWeight: "bold",
    fontSize: 18,
  },
});
