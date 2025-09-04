import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEvento } from "@/constants/EventoContext";
import { ProdutoParamsAppVendasPublico } from "@/types/RespostaParamsAppVendasPublico";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useCart } from "../../context/CartContext";
import { loadProductsLocally } from "../../services/storage";
import { GroupedProducts } from "../../types";

const HomeScreen = () => {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, cart } = useCart();
  const { eventoSelecionado } = useEvento();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const localProducts = await loadProductsLocally();
        if (localProducts) {
          const grouped = localProducts.reduce(
            (
              acc: { [key: string]: ProdutoParamsAppVendasPublico[] },
              product
            ) => {
              const group = product.grupoProduto;
              if (!acc[group]) acc[group] = [];
              acc[group].push(product);
              return acc;
            },
            {}
          );

          const groupedArray: GroupedProducts[] = Object.keys(grouped).map(
            (grupoProduto) => ({
              grupoProduto,
              data: grouped[grupoProduto].sort((a, b) =>
                a.nomeProduto.localeCompare(b.nomeProduto, "pt-BR", {
                  sensitivity: "base",
                })
              ),
            })
          );

          setGroupedProducts(groupedArray);
          if (groupedArray.length > 0) {
            setSelectedGroup(groupedArray[0].grupoProduto);
          }
        }
      } catch (error) {
        const localProducts = await loadProductsLocally();
        if (localProducts) {
          const grouped = localProducts.reduce(
            (
              acc: { [key: string]: ProdutoParamsAppVendasPublico[] },
              product
            ) => {
              const group = product.nomeProduto;
              if (!acc[group]) acc[group] = [];
              acc[group].push(product);
              return acc;
            },
            {}
          );

          const groupedArray: GroupedProducts[] = Object.keys(grouped).map(
            (grupoProduto) => ({
              grupoProduto,
              data: grouped[grupoProduto],
            })
          );

          setGroupedProducts(groupedArray);
          if (groupedArray.length > 0) {
            setSelectedGroup(groupedArray[0].grupoProduto);
          }
        } else {
          Alert.alert("Erro", "Falha ao carregar produtos " + error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [eventoSelecionado?.idEvento]);

  const renderGroupItem = ({ item }: { item: GroupedProducts }) => (
    <TouchableOpacity
      onPress={() => setSelectedGroup(item.grupoProduto)}
      style={[
        styles.groupItem,
        selectedGroup === item.grupoProduto && styles.selectedGroupItem,
      ]}
    >
      <ThemedText
        style={[
          styles.groupText,
          selectedGroup === item.grupoProduto && styles.selectedGroupText,
        ]}
      >
        {item.grupoProduto}
      </ThemedText>
    </TouchableOpacity>
  );

  const selectedProducts =
    groupedProducts.find((group) => group.grupoProduto === selectedGroup)
      ?.data || [];

  const renderProductItem = ({
    item,
  }: {
    item: ProdutoParamsAppVendasPublico;
  }) => {
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
      {loading ? (
        <ThemedText style={styles.loadingText}>Carregando...</ThemedText>
      ) : (
        <>
          <ThemedView style={styles.divider} />
          <FlatList
            data={groupedProducts}
            keyExtractor={(item) => item.grupoProduto}
            renderItem={renderGroupItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.groupList}
          />

          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.idProduto.toString()}
            renderItem={renderProductItem}
            style={styles.productList}
            contentContainerStyle={styles.productListContent}
          />
        </>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.dark.background,
    flexDirection: "column",
  },
  groupList: {
    paddingHorizontal: 5,
    paddingVertical: 15,
    flexGrow: 0,
  },
  groupItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: Colors.dark.backgroundSecondary,
    alignSelf: "flex-start",
  },
  selectedGroupItem: {
    backgroundColor: Colors.dark.tint,
  },
  groupText: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 14,
  },
  selectedGroupText: {
    color: Colors.dark.background,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  productList: {
    flex: 1,
    paddingHorizontal: 5,
  },
  productListContent: {
    flexGrow: 1,
    paddingBottom: 5,
  },
  itemTextContainer: {
    flexDirection: "column",
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  itemText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  itemValueText: {
    color: Colors.dark.text,
    fontSize: 13,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityText: {
    color: Colors.dark.tint,
    fontWeight: "bold",
    fontSize: 16,
  },

  loadingText: {
    color: Colors.dark.text,
    textAlign: "center",
    flex: 1,
  },
  buttonContainer: {
    width: 40,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: "hidden",
  },
});

export default HomeScreen;
