import { ThemedText } from "@/components/ThemedText";
import { useEvento } from "@/constants/EventoContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useCart } from "../../context/CartContext";

// Componente para exibir o total do carrinho no header
function HeaderRightTotal() {
  const { total } = useCart();
  return (
    <ThemedText
      style={{
        color: Colors.dark.tint,
        fontWeight: "bold",
        fontSize: 25,
        marginRight: 15,
      }}
    >
      R$ {total.toFixed(2)}
    </ThemedText>
  );
}

// Componente para renderizar título + evento
function HeaderTitle({ title }: { title: string }) {
  const { eventoSelecionado } = useEvento();
  return (
    <View style={{ alignItems: "flex-start" }}>
      <ThemedText
        style={{
          color: Colors.dark.text,
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {title}
      </ThemedText>
      <ThemedText style={{ color: Colors.dark.text, fontSize: 12 }}>
        {eventoSelecionado?.nomeEvento}
      </ThemedText>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor: Colors.dark.border,
        },
        tabBarActiveTintColor: Colors.dark.tint,
        tabBarInactiveTintColor: Colors.dark.tabIconDefault,
        headerStyle: { backgroundColor: Colors.dark.background },
        headerTintColor: Colors.dark.tint,
        headerTitleStyle: { color: Colors.dark.text },
        headerRight: () => <HeaderRightTotal />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Produtos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Produtos" />,
        }}
      />
      <Tabs.Screen
        name="index-list"
        options={{
          title: "Lista",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Produtos" />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Pagar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Carrinho" />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Cadastro" />,
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          href: null,
          title: "Pagamento",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Pagamento" />,
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Sair",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}