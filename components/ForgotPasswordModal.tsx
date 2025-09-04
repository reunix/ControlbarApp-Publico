import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ThemedView } from "./ThemedView";
import { showToast } from "./toast";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => Promise<void>;
  email: string;
  setEmail: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  onSubmit,
  email,
  setEmail,
}) => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const generateCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    return code;
  };

  const handleCancel = () => {
    setStep("email");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setGeneratedCode("");
    setEmail("");
    onClose();
  };

  const handleSendEmail = async () => {
    if (!email) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Por favor, insira seu e-mail",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Por favor, insira um e-mail válido",
      });
      return;
    }

    generateCode();
    showToast({
      type: "success",
      text1: "Sucesso",
      text2: "Código enviado para o e-mail",
    });
    setStep("code");
  };

  const handleConfirmPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos",
      });
      return;
    }
    if (code !== generatedCode) {
      showToast({ type: "error", text1: "Erro", text2: "Código inválido" });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Senhas não coincidem",
      });
      return;
    }
    if (newPassword.length < 6) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Senha deve ter pelo menos 6 caracteres",
      });
      return;
    }

    showToast({ type: "success", text1: "Sucesso", text2: "Senha atualizada" });
    handleCancel();
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
                Recuperar Senha
              </ThemedText>

              <View style={styles.container}>
                {step === "email" ? (
                  <>
                   <ThemedText style={styles.title}>
                      Informe seu e-mail cadastrado
                    </ThemedText>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Insira seu e-mail"
                        placeholderTextColor={Colors.dark.text}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel}
                      >
                        <ThemedText style={styles.buttonText}>
                          Cancelar
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                        onPress={handleSendEmail}
                      >
                        <ThemedText style={styles.buttonText}>
                          Enviar
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <ThemedText style={styles.title}>
                      Informe o Código e Nova Senha
                    </ThemedText>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Código de 4 dígitos"
                        placeholderTextColor={Colors.dark.text}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="numeric"
                        autoCapitalize="none"
                        maxLength={4}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={[styles.input, styles.inputWithIcon]}
                        placeholder="Nova senha"
                        placeholderTextColor={Colors.dark.text}
                        value={newPassword}
                        onChangeText={setNewPassword}
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
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={[styles.input, styles.inputWithIcon]}
                        placeholder="Confirmação de senha"
                        placeholderTextColor={Colors.dark.text}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={24}
                          color={Colors.dark.text}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel}
                      >
                        <ThemedText style={styles.buttonText}>
                          Cancelar
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                        onPress={handleConfirmPassword}
                      >
                        <ThemedText style={styles.buttonText}>
                          Confirmar
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </ThemedView>
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: "75%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  container: {
    width: "100%", // ocupa 90% da tela
    maxWidth: 400, // largura máxima
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 10,
    padding: 20,
    alignSelf: "center", // centraliza
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    // width:"90%",
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    backgroundColor: Colors.dark.backgroundSecondary,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    flex: 1,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Colors.dark.border,
  },
  submitButton: {
    backgroundColor: Colors.dark.tint,
  },
  buttonText: {
    color: Colors.dark.backgroundSecondary,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ForgotPasswordModal;
