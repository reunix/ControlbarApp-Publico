import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { showToast } from "@/components/toast";
import { cepMask, cpfMask, estados } from "@/constants/consts";
import { loadUserLocally } from "@/services/storage";
import { getUserPorEmail, updateUser } from "@/services/user-service";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskInput from "react-native-mask-input";
import { Colors } from "../../constants/Colors";

const PerfilScreen = () => {
  const [formData, setFormData] = useState({
    usersweb_nome: "",
    usersweb_email: "",
    usersweb_estado: "",
    usersweb_cpf: "",
    usersweb_cep: "",
    usersweb_endereco: "",
    usersweb_complemento: "",
    usersweb_cidade: "",
    usersweb_bairro: "",
    usersweb_numero: "",
    usersweb_ddd: "",
    usersweb_telefone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useFocusEffect(
    useCallback(() => {
      // Substitua pelo e-mail do usuário logado, ex.: vindo de AuthContext

      const fetchUser = async () => {
        setLoading(true);
        try {
          const localUser = await loadUserLocally();
          const email = localUser?.usersweb_email;

          if (!email) {
            showToast({
              type: "error",
              text1: "Erro",
              text2: "E-mail não fornecido",
            });
            setLoading(false);
            return;
          }

          const result = await getUserPorEmail(email);

          if (result) {
            setFormData((prev) => ({
              ...prev,
              ...result,
            }));
          } else {
            showToast({
              type: "error",
              text1: "Erro",
              text2: "Usuário não encontrado.",
            });
          }
        } catch (error: any) {
          showToast({
            type: "error",
            text1: "Erro",
            text2: error.message || "Erro na tentativa de buscar usuário",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
      // Não precisa de cleanup, pois não há efeitos contínuos
    }, []) // Dependência no e-mail para re-busca se mudar
  );
  const validateForm = () => {
    const requiredFields: (keyof typeof formData)[] = [
      "usersweb_nome",
      "usersweb_email",
      "usersweb_estado",
      "usersweb_cpf",
      "usersweb_cep",
      "usersweb_endereco",
      "usersweb_cidade",
      "usersweb_bairro",
      "usersweb_numero",
      "usersweb_ddd",
      "usersweb_telefone",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        Alert.alert(
          "Erro",
          `O campo ${field
            .replace("usersweb_", "")
            .replace("_", " ")} é obrigatório`
        );
        return false;
      }
    }
    if (!/\S+@\S+\.\S+/.test(formData.usersweb_email)) {
      Alert.alert("Erro", "E-mail inválido");
      return false;
    }
    if (!/^\d{11}$/.test(formData.usersweb_cpf.replace(/[\.\-]/g, ""))) {
      Alert.alert("Erro", "CPF deve conter 11 dígitos");
      return false;
    }
    if (!/^\d{8}$/.test(formData.usersweb_cep.replace(/[\-]/g, ""))) {
      Alert.alert("Erro", "CEP deve conter 8 dígitos");
      return false;
    }
    if (!/^\d{2}$/.test(formData.usersweb_ddd)) {
      Alert.alert("Erro", "DDD deve conter 2 dígitos");
      return false;
    }
    if (!/^\d{8,9}$/.test(formData.usersweb_telefone)) {
      Alert.alert("Erro", "Telefone deve conter 8 ou 9 dígitos");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    if (loading) return;
    setLoading(true);

    try {
      const result = await updateUser(formData);

      if (result.success) {
        showToast({
          type: "success",
          text1: "Sucesso",
          text2: result.message || "Cadastro atualizado com sucesso.",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast({
        type: "error",
        text1: "Erro",
        text2: "Erro na tentativa de atualizar cadastro",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}
          enableOnAndroid={true}
        >
          <View style={styles.topContainer}>
            <ThemedText
              style={{
                color: Colors.dark.tint,
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 15,
              }}
            >
              PERFIL
            </ThemedText>

            <ThemedText
              style={{
                color: Colors.dark.text,
                fontSize: 14,
                marginBottom: 15,
                paddingHorizontal: 70,
                textAlign: "center",
              }}
            >
              Para alterar sua senha, utilize a opção (Esqueci minha senha) na
              tela de login. 👍
            </ThemedText>
          </View>
          <View style={styles.formContainer}>
            {/* Seção DADOS PESSOAIS */}
            <View style={styles.sectionContainer}>
              <ThemedText style={styles.sectionTitle}>
                DADOS PESSOAIS
              </ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_nome}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_nome", text)
                  }
                  keyboardType="default"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_email}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_email", text)
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <MaskInput
                  style={styles.input}
                  placeholder="CPF (11 dígitos)"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_cpf}
                  onChangeText={(masked, unmasked) => {
                    handleInputChange("usersweb_cpf", unmasked);
                  }}
                  mask={cpfMask}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Seção ENDEREÇO */}
            <View style={styles.sectionContainer}>
              <ThemedText style={styles.sectionTitle}>ENDEREÇO</ThemedText>
              <View style={styles.inputContainer}>
                <MaskInput
                  style={styles.input}
                  placeholder="CEP (8 dígitos)"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_cep}
                  onChangeText={(masked, unmasked) =>
                    handleInputChange("usersweb_cep", unmasked)
                  }
                  mask={cepMask}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Endereço"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_endereco}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_endereco", text)
                  }
                  keyboardType="default"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Complemento (opcional)"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_complemento}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_complemento", text)
                  }
                  keyboardType="default"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Cidade"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_cidade}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_cidade", text)
                  }
                  keyboardType="default"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Bairro"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_bairro}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_bairro", text)
                  }
                  keyboardType="default"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Número"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_numero}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_numero", text)
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputContainer, styles.pickerContainer]}>
                <Picker
                  selectedValue={formData.usersweb_estado}
                  onValueChange={(value) =>
                    handleInputChange("usersweb_estado", value)
                  }
                  style={styles.picker}
                >
                  {estados.map((estado) => (
                    <Picker.Item
                      key={estado.value}
                      label={estado.label}
                      value={estado.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Seção CONTATO */}
            <View style={styles.sectionContainer}>
              <ThemedText style={styles.sectionTitle}>CONTATO</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="DDD (ex.: 11)"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_ddd}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_ddd", text)
                  }
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Telefone (8 ou 9 dígitos)"
                  placeholderTextColor={Colors.dark.text}
                  value={formData.usersweb_telefone}
                  onChangeText={(text) =>
                    handleInputChange("usersweb_telefone", text)
                  }
                  keyboardType="numeric"
                  maxLength={9}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
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
                    name="person-add"
                    size={30}
                    color={Colors.dark.backgroundSecondary}
                    style={styles.iconLeft}
                  />
                  <ThemedText style={styles.buttonText}>Cadastrar</ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
  },
  topContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  sectionTitle: {
    color: Colors.dark.tint,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: 10,
    height: 50,
    fontSize: 15,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 5,
    backgroundColor: Colors.dark.backgroundSecondary,
    overflow: "hidden",
  },
  picker: {
    flex: 1,
    height: 50,
    color: Colors.dark.text,
  },
  button: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
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
});

export default PerfilScreen;
