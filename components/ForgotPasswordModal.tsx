import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { sendEmailChangePassword, updateUser } from "@/services/user-service";
import { formatTime, validateEmail } from "@/services/utils";
import { UpdateUser } from "@/types/UpdateUser";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
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

const STORAGE_KEY = "resetPasswordData";
// const timeLeftCodeEmail = 5 * 60; // 5 minutos
const timeLeftCodeEmail = 60 * 60; // 1 hora

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
  const [timeLeft, setTimeLeft] = useState(timeLeftCodeEmail);

  const generateCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    return code;
  };

  // Recupera código salvo ao abrir modal
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { code, expiresAt } = JSON.parse(stored);
          const remaining = Math.floor((expiresAt - Date.now()) / 1000);

          if (remaining > 0) {
            setGeneratedCode(code);
            setTimeLeft(remaining);
            setStep("code");
          } else {
            await AsyncStorage.removeItem(STORAGE_KEY); // expirado
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados persistidos", error);
      }
    };

    if (visible) {
      loadStoredData();
    }
  }, [visible]);

  // Timer para contagem regressiva
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (step === "code" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && step === "code") {
      setCode("");
      setGeneratedCode("");
      AsyncStorage.removeItem(STORAGE_KEY); // limpa também do storage
      showToast({
        type: "error",
        text1: "Expirado",
        text2: "O código expirou, solicite outro.",
      });
      setStep("email");
    }

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleCancel = async () => {
    setStep("email");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setGeneratedCode("");
    setEmail("");
    setTimeLeft(timeLeftCodeEmail);
    await AsyncStorage.removeItem(STORAGE_KEY);
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

    if (!validateEmail(email)) {
      return;
    }

    const code = generateCode();
    const expiresAt = Date.now() + timeLeftCodeEmail * 1000;

    const result = await sendEmailChangePassword(email, code);

    if (!result.success) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: result.message || "Erro ao tentar enviar e-mail.",
        time: 5000,
      });
      return;
    }

    // Salva no AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ code, expiresAt })
    );

    setTimeLeft(timeLeftCodeEmail);
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

    try {
      const dataUpdateUser: UpdateUser = {
        usersweb_email: email,
        usersweb_senha: newPassword,
      };

      const result = await updateUser(dataUpdateUser);

      if (result.success) {
        showToast({
          type: "success",
          text1: "Sucesso",
          text2: result.message || "Cadastro atualizado com sucesso.",
        });
        await AsyncStorage.removeItem(STORAGE_KEY);
        handleCancel();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Erro na tentativa de atualizar cadastro",
      });
    }
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
                {step === "code"
                  ? `Recuperar Senha (${formatTime(timeLeft)})`
                  : "Recuperar Senha"}
              </ThemedText>

              {step === "code" && (
                <ThemedText
                  style={{
                    color: Colors.dark.text,
                    fontSize: 14,
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  Enviamos um código para o seu e-mail. Caso não encontre na
                  caixa de entrada, verifique também as pastas de Promoções ou
                  Spam.
                </ThemedText>
              )}

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
    width: "100%",
    maxWidth: 400,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 10,
    padding: 20,
    alignSelf: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
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
