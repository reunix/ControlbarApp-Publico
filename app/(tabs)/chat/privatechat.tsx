import { URL_API } from "@/constants/consts";
import socket from "@/services/socket";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

// interface PrivateChatScreenProps {
//   route: {
//     params: {
//       senderId: number;
//       receiverId: number;
//       senderName: string;
//       receiverName: string;
//     };
//   };
// }

interface Message {
  message_id: number;
  sender_id: number;
  content: string;
  content_type: "text" | "image";
  created_at: string;
  sender: { usersweb_nome: string };
}

export default function PrivateChatScreen() {
  const params = useLocalSearchParams<{
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
  }>();

  // Converter os IDs de string para number
  const senderId = Number(params.senderId);
  const receiverId = Number(params.receiverId);
  const senderName = params.senderName!;
  // const receiverName = params.receiverName!;

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (!senderId || !receiverId) {
      Alert.alert("Erro", "Usuário não encontrado.");
      return;
    }

    socket.connect();
    socket.emit("joinPrivateChat", { senderId, receiverId });

    socket.on("privateMessages", (msgs: Message[]) => {
      setMessages(
        msgs.map((msg) => ({
          _id: msg.message_id,
          text: msg.content_type === "text" ? msg.content : "",
          image: msg.content_type === "image" ? msg.content : undefined,
          createdAt: new Date(msg.created_at),
          user: { _id: msg.sender_id, name: msg.sender.usersweb_nome },
        }))
      );
    });

    socket.on("privateMessage", (msg: Message) => {
      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            _id: msg.message_id,
            text: msg.content_type === "text" ? msg.content : "",
            image: msg.content_type === "image" ? msg.content : undefined,
            createdAt: new Date(msg.created_at),
            user: { _id: msg.sender_id, name: msg.sender.usersweb_nome },
          },
        ])
      );
    });

    return () => {
      socket.off("privateMessages");
      socket.off("privateMessage");
      socket.disconnect();
    };
  }, [senderId, receiverId]);

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      const message = newMessages[0];
      socket.emit("sendPrivateMessage", {
        senderId,
        receiverId,
        content: message.text || message.image,
        contentType: message.image ? "image" : "text",
      });
    },
    [senderId, receiverId]
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à galeria para enviar fotos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      try {
        const response = await axios.post(
          `${URL_API}/chat/upload-image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const imageUrl = response.data.url;

        onSend([
          {
            _id: Math.random().toString(36).substring(7),
            text: "",
            image: imageUrl,
            createdAt: new Date(),
            user: { _id: senderId, name: senderName },
          },
        ]);
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        Alert.alert("Erro", "Não foi possível enviar a imagem.");
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: senderId, name: senderName }}
        renderActions={() => (
          <TouchableOpacity onPress={pickImage} style={{ padding: 10 }}>
            <Text>📷</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
