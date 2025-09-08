import { ThemedText } from "@/components/ThemedText";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { EventoProvider } from "@/constants/EventoContext";
import { CartProvider } from "@/context/CartContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";

// Componente base para toasts
const CustomToast = ({
  text1,
  text2,
  borderColor,
}: {
  text1?: string;
  text2?: string;
  borderColor: string;
}) => (
  <View
    style={{
      height: 80,
      width: "90%",
      backgroundColor: Colors.dark.background,
      borderLeftColor: borderColor,
      borderLeftWidth: 5,
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      flexDirection: "column",
      justifyContent: "center",
      alignSelf: "center",
      zIndex: 10000,
    }}
  >
    <ThemedText
      style={{
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: "bold",
      }}
    >
      {text1}
    </ThemedText>
    {text2 && (
      <ThemedText
        style={{
          color: Colors.dark.text,
          fontSize: 14,
        }}
      >
        {text2}
      </ThemedText>
    )}
  </View>
);

const toastConfig = {
  error: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <CustomToast text1={text1} text2={text2} borderColor="red" />
  ),
  success: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <CustomToast text1={text1} text2={text2} borderColor="green" />
  ),
  info: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <CustomToast text1={text1} text2={text2} borderColor="#007AFF" />
  ),
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <EventoProvider>
      <CartProvider>
        <PaperProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              {/* <Stack.Screen name="chat" options={{ headerShown: false }} /> */}

              <Stack.Screen name="+not-found" />
            </Stack>
            <Toast
              config={toastConfig}
              position="top"
              topOffset={50}
              visibilityTime={3000}
            />
            <StatusBar style="auto" />
          </ThemeProvider>
        </PaperProvider>
      </CartProvider>
    </EventoProvider>
  );
}
