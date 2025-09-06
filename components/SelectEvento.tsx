import { ThemedText } from "@/components/ThemedText";
import { EventosAbertos } from "@/types/RespostaEventosAbertos";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";

type SelectEventoProps = {
  visible: boolean;
  eventos: EventosAbertos[];
  onSelect: (evento: EventosAbertos) => void;
  onClose: () => void;
};

export default function SelectEvento({
  visible,
  eventos,
  onSelect,
  onClose,
}: SelectEventoProps) {
  const [isModalReady, setIsModalReady] = useState(false);

  useEffect(() => {
    // console.log("Modal visibilidade mudou para:", visible);
    if (visible) {
      setIsModalReady(false); // Reseta o estado ao abrirc

      setTimeout(() => setIsModalReady(true), 100); // Dá tempo para a renderização
    } else {
      setIsModalReady(false);
    }
  }, [visible]);

  const handleSelect = (item: EventosAbertos) => {
    onSelect(item);
    // onClose();
  };

  const renderItem = ({ item }: { item: EventosAbertos }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.text}>
            {item.nomeEvento.toUpperCase()}
          </ThemedText>
          <ThemedText style={styles.textNomeCliente}>
            {item.nomeCliente}
          </ThemedText>
          <ThemedText style={styles.textEndereco}>
            {item.enderecoCompleto || "Endereço não informado"}
          </ThemedText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={Colors.dark.tint}
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  );

  if (!isModalReady) return null; // Evita renderização parcial

  return (
    <Modal
      visible={visible}
      animationType="slide" // Desativado temporariamente para teste
      transparent={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close-circle" size={32} color={Colors.dark.tint} />
        </TouchableOpacity>

        {eventos.length > 1 && (
          <ThemedText
            style={{
              color: Colors.dark.text,
              fontSize: 14,
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            Ops! Há mais de um evento por perto. Escolha com atenção o evento
            desejado! 😊
          </ThemedText>
        )}

        <ThemedText
          style={{
            color: Colors.dark.tint,
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 15,
          }}
        >
          SELECIONE O EVENTO
        </ThemedText>

        <View style={styles.container}>
          <FlatList
            data={eventos}
            keyExtractor={(item) => item.idEvento.toString()}
            renderItem={renderItem}
            initialNumToRender={10}
            windowSize={5}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  text: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 14,
  },
  textNomeCliente: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  textEndereco: {
    color: Colors.dark.text,
    fontSize: 10,
  },
  icon: {
    marginLeft: 10,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 20,
    zIndex: 10,
  },
});
