import { Colors } from "@/constants/Colors";
import { URL_API } from "@/constants/consts";
import socket from "@/services/socket";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GiftedChat, IMessage, Send } from "react-native-gifted-chat";

// Componente memoizado para imagens
const ChatImage = React.memo(
  ({ uri, onPress }: { uri: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri }}
        style={{ width: 200, height: 200, borderRadius: 8, marginVertical: 5 }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  )
);

// Define o displayName para evitar o aviso do ESLint
ChatImage.displayName = "ChatImage";
interface Message {
  message_id: number;
  user_id: number;
  content: string;
  content_type: "text" | "image";
  created_at: string;
  user: { usersweb_nome: string };
}

export default function EventChatScreen() {
  const route = useRoute();
  const { eventId, userId, userName } = route.params as {
    eventId: number;
    userId: number;
    userName: string;
  };

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const [showFirstMessageModal, setShowFirstMessageModal] = useState(false);

  useEffect(() => {
    if (!eventId || !userId) {
      Alert.alert("Erro", "Evento ou usuário não encontrado.");
      return;
    }

    socket.connect();

    const handleConnect = () => {
      socket.emit("joinEvent", { eventId, userId });
    };

    socket.on("connect", handleConnect);

    // Histórico de mensagens
    socket.on("groupMessages", (msgs: Message[]) => {
      setMessages(
        msgs
          .slice()
          .reverse()
          .map((msg) => ({
            _id: msg.message_id,
            text: msg.content_type === "text" ? msg.content : "",
            image:
              msg.content_type === "image"
                ? `${URL_API}${msg.content}`
                : undefined,
            createdAt: new Date(msg.created_at),
            user: {
              _id: msg.user_id,
              name: msg.user?.usersweb_nome ?? "Desconhecido",
            },
          }))
      );
    });

    socket.on("groupMessage", (msg: Message) => {
      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            _id: msg.message_id,
            text: msg.content_type === "text" ? msg.content : "",
            image:
              msg.content_type === "image"
                ? `${URL_API}${msg.content}`
                : undefined,
            createdAt: new Date(msg.created_at),
            user: {
              _id: msg.user_id,
              name:
                msg.user?.usersweb_nome ||
                (msg.user_id === userId ? userName : "Desconhecido"),
            },
          },
        ])
      );
    });

    // **Novo listener para primeira mensagem**
    socket.on("firstMessage", ({ messageId }) => {
      setShowFirstMessageModal(true);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("groupMessages");
      socket.off("groupMessage");
      socket.off("firstMessage");
      socket.disconnect();
    };
  }, [eventId, userId, userName]);

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      if (!newMessages.length) {
        console.warn("⚠️ Nenhuma mensagem recebida no onSend");
        return;
      }

      const message = newMessages[0];

      if (!message.text && !message.image) {
        return;
      }

      try {
        socket.emit("sendGroupMessage", {
          eventId,
          userId,
          content: message.text || message.image,
          contentType: message.image ? "image" : "text",
        });

        // adiciona local imediatamente
        // setMessages((prev) => GiftedChat.append(prev, newMessages));
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        Alert.alert("Erro", "Não foi possível enviar a mensagem.");
      }
    },
    [eventId, userId]
  );

  const sendImage = async (localUri: string) => {
    const tempId = `temp-${Date.now()}`;

    setMessages((prev) =>
      GiftedChat.append(prev, [
        {
          _id: tempId,
          text: "Carregando...",
          user: { _id: userId, name: userName },
          createdAt: new Date(),
        },
      ])
    );

    try {
      const filename = localUri.split("/").pop() || `photo-${Date.now()}.jpg`;

      // 🔑 Usa fetch -> blob para garantir compatibilidade Android/iOS
      const responseFetch = await fetch(localUri);
      const blob = await responseFetch.blob();

      const formData = new FormData();
      formData.append("file", {
        uri: localUri,
        type: blob.type || "image/jpeg",
        name: filename,
      } as any);

      const urlImage = `${URL_API}/chat/upload-image`;
      const response = await axios.post(urlImage, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const relativePath = response.data.url;

      // Remove temporária e manda real
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));

      socket.emit("sendGroupMessage", {
        eventId,
        userId,
        content: relativePath,
        contentType: "image",
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.error("❌ Erro ao enviar imagem:", error);
      Alert.alert("Erro", "Não foi possível enviar a imagem.");
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await sendImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPerm.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await sendImage(result.assets[0].uri);
    }
  };

  const handleImagePress = (imageUrl: string) => {
    router.push({
      pathname: "/chat/viewimage",
      params: { image: imageUrl },
    });
  };

  const handleUserPress = (user: { _id: number; name: string }) => {
    router.push({
      pathname: "/chat/privatechat",
      params: {
        senderId: String(userId),
        senderName: userName,
        receiverId: String(user._id),
        receiverName: user.name,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <GiftedChat
        messages={messages}
        placeholder="Digite uma mensagem..."
        onSend={onSend}
        user={{ _id: userId, name: userName }}
        renderMessageImage={(props) => {
          const imageUrl = props.currentMessage.image;
          if (!imageUrl) return null;
          return (
            <ChatImage
              uri={imageUrl}
              onPress={() => handleImagePress(imageUrl)}
            />
          );
        }}
        renderSend={(props) => (
          <Send {...props}>
            <View style={styles.IconSend}>
              <Ionicons
                name="send"
                size={24}
                color={Colors.dark.backgroundSecondary}
              />
            </View>
          </Send>
        )}
        renderActions={() => (
          <View>
            {/* Botão ... */}
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.moreButton}
            >
              <Text style={styles.moreText}>...</Text>
            </TouchableOpacity>

            {/* Menu suspenso */}
            <Modal
              transparent
              visible={menuVisible}
              animationType="fade"
              onRequestClose={() => setMenuVisible(false)}
            >
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setMenuVisible(false)}
              >
                <View style={styles.menuContainer}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      pickImage();
                    }}
                  >
                    <Text style={styles.menuText}>🗂️ Escolher imagem</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      takePhoto();
                    }}
                  >
                    <Text style={styles.menuText}>📷 Tirar foto</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={styles.menuText}>📆 Próximos Eventos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={styles.menuText}>🗓️ Eventos Controlbar</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={styles.menuText}>😍 Jogar Match</Text>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={styles.menuText}>ℹ️ Sobre o Chat</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
        onPressAvatar={handleUserPress}
      />

      {showFirstMessageModal && (
        <Modal
          transparent
          visible={showFirstMessageModal}
          animationType="fade"
          onRequestClose={() => setShowFirstMessageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>⚠️ Aviso Importante ⚠️</Text>
                <Text style={styles.modalText}>
                  {userName}, lembre-se:
                  {"\n\n"}• Não envie imagens ou textos ofensivos.
                  {"\n"}• Mantenha o respeito com outros participantes.
                  {"\n"}• Todas as mensagens serão **perdidas** quando o evento
                  for encerrado.
                  {"\n\n"}
                  Aproveite e participe de forma divertida e segura!
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowFirstMessageModal(false)}
                >
                  <Text style={styles.modalButtonText}>Entendi</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    marginRight: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  IconSend: {
    marginRight: 10,
    marginBottom: 10,
    padding: 5,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 20,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  moreText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    width: 200,
    margin: 10,
    marginBottom: 60,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "85%",
    maxHeight: "80%", // 👈 limita altura e permite scroll
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: Colors.dark.tint,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalContent: {
    paddingBottom: 20,
  },
});
