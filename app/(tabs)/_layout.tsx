import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useEvento } from "@/constants/EventoContext";
import { useCart } from "@/context/CartContext";
import { loadUserLocally } from "@/services/storage";
import { useEffect, useState } from "react";
import { View } from "react-native";

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
      <ThemedText style={{ color: Colors.dark.tint, fontSize: 12 }}>
        {eventoSelecionado?.nomeEvento}
      </ThemedText>
    </View>
  );
}

export default function TabsLayout() {
  const { eventoSelecionado } = useEvento();
  const [user, setUser] = useState<{
    usersweb_id: number;
    usersweb_nome: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const loadedUser = await loadUserLocally();
      if (loadedUser?.usersweb_id && loadedUser.usersweb_nome) {
        setUser({
          usersweb_id: loadedUser.usersweb_id,
          usersweb_nome: loadedUser.usersweb_nome,
        });
      } else setUser(null);
    };
    fetchUser();
  }, []);

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
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              size={size}
              color={color}
            />
          ),
          headerTitle: () => (
            <HeaderTitle title="Chat" />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();

            if (
              eventoSelecionado?.idEvento &&
              user?.usersweb_id &&
              user?.usersweb_nome
            ) {
              navigation.navigate("chat", {
                screen: "eventchat",
                params: {
                  eventId: eventoSelecionado.idEvento,
                  userId: user.usersweb_id,
                  userName: user.usersweb_nome,
                },
              });
            } else {
              console.warn("Usuário ou evento não encontrado");
              navigation.navigate("login");
            }
          },
        })}
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
