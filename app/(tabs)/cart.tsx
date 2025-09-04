import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CartItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useCart } from "../../context/CartContext";
import { showToast } from "@/components/toast";

const CartScreen = () => {
  const { addToCart, removeFromCart, cart, total, clearCart } = useCart();
  const router = useRouter();

  const handleClearCart = () => {
    clearCart();
    showToast({
      type: "success",
      text1: "Atenção",
      text2: "Carrinho zerado com sucesso!",
    });

    router.push("/(tabs)");
  };

  const handlePayment = () => {
    router.push("/(tabs)/payment");
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const quantity =
      cart.find((c) => c.idProduto === item.idProduto)?.quantity || 0;

    return (
      <ThemedView style={styles.item}>
        <View style={styles.itemTextContainer}>
          <ThemedText style={styles.itemText}>
            {item.nomeProduto.toLocaleUpperCase()}
          </ThemedText>
          <ThemedText style={styles.itemValueText}>
            R$ {item.valorProduto.toFixed(2)}
          </ThemedText>
        </View>

        <View style={styles.buttons}>
          <View style={styles.buttonContainer}>
            <Button
              title="-"
              onPress={() => removeFromCart(item.idProduto)}
              color={Colors.dark.backgroundSecondary}
            />
          </View>
          <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
          <View style={styles.buttonContainer}>
            <Button
              title="+"
              onPress={() => addToCart(item)}
              color={Colors.dark.backgroundSecondary}
            />
          </View>
        </View>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.idProduto.toString()}
        renderItem={renderItem}
        style={styles.productList}
        contentContainerStyle={[
          styles.productListContent,
          cart.length === 0 && {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            Nenhum produto no carrinho
          </ThemedText>
        }
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.buttonClearCart, total <= 0 && styles.buttonDisabled]}
          onPress={handleClearCart}
          disabled={total <= 0}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={total <= 0 ? Colors.dark.tabIconDefault : Colors.dark.text}
          />
          <ThemedText
            style={[
              styles.buttonTextClearCart,
              total <= 0 && styles.buttonTextDisabled,
            ]}
          >
            Limpar
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, total <= 0 && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={total <= 0}
        >
          <Ionicons
            name="card"
            size={20}
            color={total <= 0 ? Colors.dark.tabIconDefault :  Colors.dark.backgroundSecondary}
          />
          <ThemedText
            style={[
              styles.buttonText,
              total <= 0 && styles.buttonTextDisabled,
            ]}
          >
            Pagamento
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: Colors.dark.background,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    backgroundColor: Colors.dark.backgroundSecondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  productList: {
    flex: 1,
    paddingBottom: 5,
  },
  productListContent: {
    flexGrow: 1,
    paddingHorizontal: 5,
  },
  itemTextContainer: {
    flexDirection: "column",
  },
  itemValueText: {
    color: Colors.dark.text,
    fontSize: 13,
  },
  buttonContainer: {
    width: 40,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: "hidden",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  quantityText: {
    color: Colors.dark.tint,
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.dark.background,
    marginBottom:5
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.tint,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "45%", // Ajustado para evitar sobreposição
    marginHorizontal: 5,
  },
  buttonClearCart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark. backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "45%", 
    marginHorizontal: 5,
    borderWidth: 1,
    // borderColor: 'red',
  },
  buttonDisabled: {
    backgroundColor: Colors.dark.backgroundSecondary,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.dark.backgroundSecondary,
    fontWeight: "bold",
    fontSize: 16, // Reduzido para melhor ajuste
    marginLeft: 8,
  },
  buttonTextClearCart: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 16, // Reduzido para melhor ajuste
    marginLeft: 8,
  },
  buttonTextDisabled: {
    color: Colors.dark.tabIconDefault,
  },
});

export default CartScreen;