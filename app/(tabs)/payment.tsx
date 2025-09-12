import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { showToast } from "@/components/toast";
import { useEvento } from "@/constants/EventoContext";
import { Ionicons } from "@expo/vector-icons";
import { Buffer } from "buffer";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import CardPaymentModal from "../../components/CardPaymentModal";
import { Colors } from "../../constants/Colors";
import { useCart } from "../../context/CartContext";
import { useFocusEffect } from "expo-router";

const PaymentScreen = () => {
  const { cart, total } = useCart();
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<string>("");
  const [qrError, setQrError] = useState<string | null>(null);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const { eventoSelecionado } = useEvento();

  const [paymentOption, setPaymentOption] = useState<"app" | "evento">("app");

  const formPagtoMap: Record<string, number> = {
    Crédito: 1,
    Débito: 2,
    Pix: 5,
  };


  useFocusEffect(
    useCallback(() => {
      setPaymentOption("app"); // resetar para "app" ao entrar na tela
    }, [])
  );
  
  const handlePayment = (method: string) => {
    if (total <= 0) {
      showToast({
        type: "info",
        text1: "Atenção",
        text2: "Nenhum produto no carrinho.",
      });
      return;
    }

    if (paymentOption === "app") {
      setIsCardModalVisible(true);
    } else {
      setShowQR(true);
      setQrData("");
      setQrError(null);

      setTimeout(() => {
        try {
          const dadosQR = {
            p: cart.map((item) => ({ id: item.idProduto, q: item.quantity })),
            ev: eventoSelecionado?.idEvento,
            fp: formPagtoMap[method],
            tt: total.toFixed(2),
          };
          const jsonStr = JSON.stringify(dadosQR);
          const base64Str = Buffer.from(jsonStr).toString("base64");
          setQrData(base64Str);
        } catch (e: any) {
          console.error("Erro ao gerar QRCode:", e);
          setQrError(String(e));
        }
      }, 300);
    }
  };

  const handleCardPayment = (data: any) => {
    showToast({
      type: "success",
      text1: "Atenção",
      text2: "Pagamento processado com sucesso!",
    });
  };

  let qrElement = null;
  if (qrError) {
    qrElement = (
      <ThemedText style={{ color: "red" }}>Erro: {qrError}</ThemedText>
    );
  } else if (qrData) {
    try {
      qrElement = <QRCode value={qrData} size={250} ecl="M" />;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      qrElement = (
        <ThemedText style={{ color: "red" }}>
          Erro ao renderizar QRCode
        </ThemedText>
      );
    }
  }

  return (
    <ThemedView style={styles.container}>
      {/* Radio Buttons */}
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setPaymentOption("app")}
        >
          <View style={styles.radioCircle}>
            {paymentOption === "app" && <View style={styles.radioChecked} />}
          </View>
          <ThemedText style={styles.radioLabel}>Pagar no App</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setPaymentOption("evento")}
        >
          <View style={styles.radioCircle}>
            {paymentOption === "evento" && <View style={styles.radioChecked} />}
          </View>
          <ThemedText style={styles.radioLabel}>Pagar no Evento</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Texto explicativo */}
      <ThemedText style={styles.paymentDescription}>
        {paymentOption === "app"
          ? "ℹ️  O pagamento será realizado diretamente neste aplicativo. Escolha uma das formas de pagamento abaixo e finalize a compra. Após a confirmação, você receberá os comprovantes (QRCodes) para retirada dos produtos no evento."
          : "ℹ️ Escolha uma forma de pagamento e gere o QRCode neste aplicativo. Em seguida, dirija-se a um ponto de venda no evento, apresente o QRCode para processar a compra e receber os comprovantes para retirada dos produtos."}
      </ThemedText>

      {/* Botões de pagamento */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePayment("Crédito")}
      >
        <Ionicons
          name="card"
          size={40}
          color={Colors.dark.text}
          style={styles.iconLeft}
        />
        <ThemedText style={styles.buttonText}>CRÉDITO</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePayment("Débito")}
      >
        <Ionicons
          name="card"
          size={40}
          color={Colors.dark.text}
          style={styles.iconLeft}
        />
        <ThemedText style={styles.buttonText}>DÉBITO</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePayment("Pix")}
      >
        <Ionicons
          name="qr-code-outline"
          size={40}
          color={Colors.dark.text}
          style={styles.iconLeft}
        />
        <ThemedText style={styles.buttonText}>PIX</ThemedText>
      </TouchableOpacity>

      {/* QR Modal */}
      <Modal visible={showQR} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowQR(false)}
            >
              <Ionicons
                name="close-circle"
                size={32}
                color={Colors.dark.tint}
              />
            </TouchableOpacity>
            <ThemedText
              type="subtitle"
              style={{ marginBottom: 20, color: Colors.dark.background }}
            >
              Escaneie o QRCode para pagamento
            </ThemedText>
            {qrData === "" && !qrError ? (
              <>
                <ActivityIndicator
                  size="large"
                  color={Colors.dark.background}
                />
                <ThemedText style={{ marginTop: 15 }}>
                  Gerando QRCode...
                </ThemedText>
              </>
            ) : (
              qrElement
            )}
          </View>
        </View>
      </Modal>

      <CardPaymentModal
        visible={isCardModalVisible}
        onConfirm={handleCardPayment}
        onClose={() => setIsCardModalVisible(false)}
        nomeUsuario={eventoSelecionado?.nomeEvento}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.dark.background,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 25,
    marginTop: 5,
  },
  radioOption: { flexDirection: "row", alignItems: "center" },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.dark.tint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.tint,
  },
  radioLabel: { color: Colors.dark.text, fontSize: 14 },
  paymentDescription: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    height: 100,
    width: "99%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.backgroundSecondary,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    position: "relative",
  },
  buttonText: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 20,
  },
  iconLeft: {
    position: "absolute",
    left: 15,
    color: Colors.dark.tint,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.dark.text,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
});

export default PaymentScreen;
