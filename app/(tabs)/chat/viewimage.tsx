import { URL_API } from "@/constants/consts";
import { useRoute } from "@react-navigation/native";
import { Image, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";

export default function ViewImageScreen() {
  const route = useRoute();
  const { image } = route.params as { image: string };

  const fullUrl = image.startsWith("http") ? image : `${URL_API}${image}`;

  return (
    <View style={styles.container}>
      {/* Botão X */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: fullUrl }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 20, // ajuste se precisar
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    borderWidth:1,
    borderColor:'green',
    padding: 10,
  },
  closeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
