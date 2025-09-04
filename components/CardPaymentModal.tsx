import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "../constants/Colors";
import { showToast } from "./toast";

type CardPaymentDetails = {
  cardNumber: string;
  cardName: string;
  cardExpiration: string;
  cardCvv: string;
  saveCard: boolean;
};

type CardPaymentModalProps = {
  visible: boolean;
  onConfirm: (data: CardPaymentDetails) => void;
  onClose: () => void;
  nomeUsuario: string | undefined;
};

export default function CardPaymentModal({
  visible,
  onConfirm,
  onClose,
  nomeUsuario,
}: CardPaymentModalProps) {
  const [paymentData, setPaymentData] = useState<CardPaymentDetails>({
    cardNumber: "",
    cardName: nomeUsuario || "",
    cardExpiration: "",
    cardCvv: "",
    saveCard: false,
  });
  const [showCvv, setShowCvv] = useState(false);
  const [saveCardData, setSaveCardData] = useState(false);

  const formatCardNumber = (input: string): string => {
    const digits = input.replace(/\D/g, "");
    const groups = digits.match(/(\d{1,4})/g) || [];
    return groups.join("-").slice(0, 19);
  };

  const formatExpirationDate = (input: string): string => {
    const digits = input.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`.slice(0, 5);
  };

  const handlePaymentInputChange = (
    field: keyof CardPaymentDetails,
    value: string
  ) => {
    let formattedValue = value;
    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "cardExpiration") {
      formattedValue = formatExpirationDate(value);
    }
    setPaymentData((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const validatePaymentForm = () => {
    const requiredFields: (keyof CardPaymentDetails)[] = [
      "cardNumber",
      "cardName",
      "cardExpiration",
      "cardCvv",
    ];
    for (const field of requiredFields) {
      if (!paymentData[field]) {

        showToast({
          type: "error",
          text1: "Atenção",
          text2:  `O campo ${field} é obrigatório`,
        });
        // Alert.alert();
        return false;
      }
    }
    const cleanCardNumber = paymentData.cardNumber.replace(/-/g, "");
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      Alert.alert("Erro", "Número do cartão deve conter 16 dígitos");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(paymentData.cardExpiration)) {
      Alert.alert("Erro", "Data de expiração deve estar no formato MM/AA");
      return false;
    }
    const [month, year] = paymentData.cardExpiration.split("/").map(Number);
    if (month < 1 || month > 12) {
      Alert.alert("Erro", "O mês deve estar entre 01 e 12");
      return false;
    }
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      Alert.alert("Erro", "O cartão está vencido");
      return false;
    }
    if (!/^\d{3,4}$/.test(paymentData.cardCvv)) {
      Alert.alert("Erro", "CVV deve conter 3 ou 4 dígitos");
      return false;
    }
    if (paymentData.cardName.length > 100) {
      Alert.alert("Erro", "Nome do titular deve ter no máximo 100 caracteres");
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (!validatePaymentForm()) return;
    onConfirm({
      ...paymentData,
      cardNumber: paymentData.cardNumber.replace(/-/g, ""),
      cardExpiration: paymentData.cardExpiration,
      saveCard: saveCardData,
    });
    setPaymentData({
      cardNumber: "",
      cardName: "",
      cardExpiration: "",
      cardCvv: "",
      saveCard: false,
    });
    setSaveCardData(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <ThemedView style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ height: "100%" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={30}
            enableOnAndroid={true}
          >
            <ThemedView style={styles.container}>
              <ThemedText
                style={{
                  color: Colors.dark.tint,
                  fontWeight: "bold",
                  fontSize: 20,
                  marginBottom: 15,
                  textAlign: "center",
                }}
              >
                PAGAMENTO COM CARTÃO
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Número do cartão (16 dígitos)"
                placeholderTextColor={Colors.dark.text}
                value={paymentData.cardNumber}
                onChangeText={(text) =>
                  handlePaymentInputChange("cardNumber", text)
                }
                keyboardType="numeric"
                maxLength={19}
              />
              <TextInput
                style={styles.input}
                placeholder="Nome do titular"
                placeholderTextColor={Colors.dark.text}
                value={paymentData.cardName}
                onChangeText={(text) =>
                  handlePaymentInputChange("cardName", text)
                }
                keyboardType="default"
              />
              <TextInput
                style={styles.input}
                placeholder="Data de expiração (MM/AA)"
                placeholderTextColor={Colors.dark.text}
                value={paymentData.cardExpiration}
                onChangeText={(text) =>
                  handlePaymentInputChange("cardExpiration", text)
                }
                keyboardType="numeric"
                maxLength={5}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="CVV (3 ou 4 dígitos)"
                  placeholderTextColor={Colors.dark.text}
                  value={paymentData.cardCvv}
                  onChangeText={(text) =>
                    handlePaymentInputChange("cardCvv", text)
                  }
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry={!showCvv}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowCvv(!showCvv)}
                >
                  <Ionicons
                    name={showCvv ? "eye-off" : "eye"}
                    size={24}
                    color={Colors.dark.text}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  onPress={() => setSaveCardData(!saveCardData)}
                  style={styles.checkbox}
                >
                  <Ionicons
                    name={saveCardData ? "checkbox" : "checkbox-outline"}
                    size={24}
                    color={Colors.dark.tint}
                  />
                </TouchableOpacity>
                <ThemedText style={styles.checkboxText}>
                  Salvar dados do cartão
                </ThemedText>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setPaymentData({
                      cardNumber: "",
                      cardName: "",
                      cardExpiration: "",
                      cardCvv: "",
                      saveCard: false,
                    });
                    setSaveCardData(false);
                    onClose();
                  }}
                >
                  <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                  <ThemedText style={styles.buttonText}>Confirmar</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: "75%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
  },
  container: {
    width: "90%",
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 10,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    marginBottom: 10,
    borderColor: Colors.dark.border,
    padding: 10,
    height: 50,
    fontSize: 17,
    borderRadius: 5,
    color: Colors.dark.text,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    height: 50,
    justifyContent: "center",
    padding: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  button: {
    flex: 1,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.tint,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Colors.dark.border,
  },
  buttonText: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
});
