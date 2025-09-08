import CreateNewUserModal from "@/components/CreateNewUserModal";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import SelectEvento from "@/components/SelectEvento";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { showToast } from "@/components/toast";
import { useEvento } from "@/constants/EventoContext";
import { useCart } from "@/context/CartContext";
import { fetchEventosAbertos } from "@/services/eventos-service";
import { saveProductsLocally, saveUserLocally } from "@/services/storage";
import { login } from "@/services/user-service";
import { EventosAbertos } from "@/types/RespostaEventosAbertos";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { fetchProducts } from "../services/product-service";

const LoginScreen = () => {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("9966335");
  const [showPassword, setShowPassword] = useState(false);
  const [eventosAbertos, setEventosAbertos] = useState<EventosAbertos[]>([]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [createNewUserModalVisible, setCreateNewUserModalVisible] =
    useState(false);
  const [email, setEmail] = useState("");
  const [saveLogin, setSaveLogin] = useState(false);
  const { setEventoSelecionado } = useEvento();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { clearCart } = useCart();
  const SEARCH_RADIUS = 100;
  const [locationAttempts, setLocationAttempts] = useState(0);

  // Load saved CPF and get user location on mount
  useEffect(() => {
    const loadSavedCpf = async () => {
      try {
        const savedCpf = await AsyncStorage.getItem("savedCpf");
        if (savedCpf) {
          setCpf(savedCpf);
          setSaveLogin(true);
        }
      } catch (error) {
        console.error("Erro ao carregar CPF salvo:", error);
      }
    };

    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showToast({
            type: "error",
            text1: "Permissão negada",
            text2:
              "Não foi possível obter sua localização. Nenhum evento localizado.",
          });
          setUserLocation(null);
          setLocationLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        showToast({
          type: "error",
          text1: "Erro",
          text2: "Falha ao obter localização.",
        });
        setUserLocation(null);
        setLocationLoading(false);
      } finally {
        setLocationLoading(false);
      }
    };

    loadSavedCpf();
    getUserLocation();
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const filterNearbyEvents = (events: EventosAbertos[]): EventosAbertos[] => {
    if (!userLocation) {
      showToast({
        type: "error",
        text1: "Atenção",
        text2:
          "Não foi possível verificar sua localização, nenhum evento foi encontrado.",
      });
      return [];
    }

    const nearby = events
      .filter((event) => {
        if (
          !event.latitude ||
          !event.longitude ||
          isNaN(event.latitude) ||
          isNaN(event.longitude)
        ) {
          console.log(`Evento ${event.nomeEvento} com coordenadas inválidas:`, {
            latitude: event.latitude,
            longitude: event.longitude,
          });
          return false;
        }
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          event.latitude,
          event.longitude
        );
        return distance <= SEARCH_RADIUS;
      })
      .sort((a, b) => {
        const distA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );
        const distB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      });

    return nearby;
  };

  // Função para tentar obter localização novamente
  const retryGetUserLocation = async () => {
    const maxAttempts = 2; // Limite de tentativas
    if (locationAttempts >= maxAttempts) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível obter sua localização após várias tentativas.",
      });
      setLoading(false);
      setLocationLoading(false);
      return false;
    }

    setLocationAttempts((prev) => prev + 1);
    setLocationLoading(true);
    showToast({
      type: "info",
      text1: "Atenção",
      text2: "Tentando obter sua localização novamente...",
    });

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showToast({
          type: "error",
          text1: "Permissão negada",
          text2: "Não foi possível obter sua localização.",
        });
        setUserLocation(null);
        setLocationLoading(false);
        return false;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationLoading(false);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Falha ao obter localização.",
      });
      setUserLocation(null);
      setLocationLoading(false);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!cpf) {
      showToast({
        type: "info",
        text1: "Atenção",
        text2: "Por favor, insira seu CPF",
      });
      return;
    }
    if (!senha) {
      showToast({
        type: "info",
        text1: "Atenção",
        text2: "Por favor, insira sua senha",
      });
      return;
    }

    if (loading || locationLoading) return;
    setLoading(true);

    try {
      const dataUserResponse = await login(cpf, senha);

      if (dataUserResponse) {
        if (saveLogin) {
          await AsyncStorage.setItem("savedCpf", cpf);
        } else {
          await AsyncStorage.removeItem("savedCpf");
        }

        if (!userLocation) {
          showToast({
            type: "error",
            text1: "Atenção",
            text2:
              "Não foi possível verificar sua localização, tentando novamente...",
          });
          const locationSuccess = await retryGetUserLocation();
          if (!locationSuccess) {
            setLoading(false);
            return;
          }
        }

        let eventosAbertosData = await fetchEventosAbertos();
        let filteredEvents = filterNearbyEvents(eventosAbertosData);

        if (filteredEvents.length === 0) {
          showToast({
            type: "error",
            text1: "Atenção",
            text2: `Nenhum evento encontrado dentro de ${SEARCH_RADIUS} metros, tentando novamente...`,
          });
          const locationSuccess = await retryGetUserLocation();
          if (!locationSuccess) {
            setLoading(false);
            return;
          }
          eventosAbertosData = await fetchEventosAbertos();
          filteredEvents = filterNearbyEvents(eventosAbertosData);
          if (filteredEvents.length === 0) {
            showToast({
              type: "error",
              text1: "Atenção",
              text2: `Nenhum evento encontrado dentro de ${SEARCH_RADIUS} metros.`,
            });
            setLoading(false);
            return;
          }
        }

        setEventosAbertos(filteredEvents);

        await saveUserLocally(dataUserResponse);

        if (filteredEvents.length === 1 && userLocation) {
          await handleSelectEvento(filteredEvents[0]);
        } else {
          setModalVisible(true);
        }
      } else {
        showToast({
          type: "error",
          text1: "Erro de Login",
          text2: "CPF ou senha incorretos. Tente novamente.",
        });
        setLoading(false);
      }
    } catch (error: any) {
      // console.error("Erro ao realizar login:", error);
      showToast({
        type: "error",
        text1: "Erro",
        text2: error || "Falha ao realizar login",
      });
      setLoading(false);
    }
  };

  const handleSelectEvento = async (evento: EventosAbertos) => {
    setEventoSelecionado(evento);
    setLoading(true);

    try {
      clearCart();
      const products = await fetchProducts(evento.idEvento);
      await saveProductsLocally(products.produtos);
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 50);
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Falha ao carregar produtos",
      });
    } finally {
      setModalVisible(false);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    console.log("ok:handleForgotPassword");
    // A lógica de envio de e-mail foi movida para o ForgotPasswordModal
    // Aqui apenas mantemos a compatibilidade com o onSubmit
    // Alert.alert("ok");
    return;
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topContainer}>
            <Image
              source={require("../assets/images/logomarca.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.mensagemText}>
              Antecipe sua compra com a Controlbar
            </ThemedText>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Insira seu CPF"
                placeholderTextColor={Colors.dark.text}
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                placeholder="Insira sua senha"
                placeholderTextColor={Colors.dark.text}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color={Colors.dark.text}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setForgotPasswordModalVisible(true)}
            >
              <ThemedText style={styles.forgotPasswordText}>
                Esqueci minha senha
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                (loading || locationLoading) && { opacity: 0.7 },
              ]}
              onPress={handleLogin}
              disabled={loading || locationLoading}
            >
              {locationLoading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={Colors.dark.backgroundSecondary}
                  />
                  <ThemedText style={styles.buttonText}>
                    {" "}
                    Pegando localização, aguarde...
                  </ThemedText>
                </>
              ) : loading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={Colors.dark.backgroundSecondary}
                  />
                  <ThemedText style={styles.buttonText}> Aguarde...</ThemedText>
                </>
              ) : (
                <>
                  <Ionicons
                    name="log-in"
                    size={30}
                    color={Colors.dark.backgroundSecondary}
                    style={styles.iconLeft}
                  />
                  <ThemedText style={styles.buttonText}>Login</ThemedText>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.postButtonContainer}>
              <TouchableOpacity
                onPress={() => setCreateNewUserModalVisible(true)}
              >
                <ThemedText style={styles.cadastrarme}>
                  Criar uma conta
                </ThemedText>
              </TouchableOpacity>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  onPress={() => setSaveLogin(!saveLogin)}
                  style={styles.checkbox}
                >
                  <Ionicons
                    name={saveLogin ? "checkbox" : "checkbox-outline"}
                    size={24}
                    color={Colors.dark.tint}
                  />
                </TouchableOpacity>
                <ThemedText style={styles.checkboxText}>
                  Salvar login
                </ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SelectEvento
        visible={modalVisible}
        eventos={eventosAbertos}
        onSelect={handleSelectEvento}
        onClose={() => {
          setModalVisible(false);
          setLoading(false);
        }}
      />

      <ForgotPasswordModal
        visible={forgotPasswordModalVisible}
        onClose={() => setForgotPasswordModalVisible(false)}
        onSubmit={handleForgotPassword}
        email={email}
        setEmail={setEmail}
      />

      <CreateNewUserModal
        visible={createNewUserModalVisible}
        onClose={() => setCreateNewUserModalVisible(false)}
        onSubmit={handleForgotPassword}
        email={email}
        setEmail={setEmail}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  mensagemText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 5,
    backgroundColor: Colors.dark.backgroundSecondary,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    height: 50,
    fontSize: 15,
    color: Colors.dark.text,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  button: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 8,
    position: "relative",
    marginTop: 20,
  },
  buttonText: {
    color: Colors.dark.backgroundSecondary,
    fontWeight: "bold",
    fontSize: 20,
  },
  iconLeft: {
    position: "absolute",
    left: 15,
  },
  postButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  forgotPasswordText: {
    color: Colors.dark.tint,
    fontSize: 14,
  },
  cadastrarme: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 5,
  },
  checkboxText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
});

export default LoginScreen;
