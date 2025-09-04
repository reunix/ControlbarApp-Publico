import { ThemedText } from "@/components/ThemedText";
import { EventosAbertos } from "@/types/RespostaEventosAbertos";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
  const renderItem = ({ item }: { item: EventosAbertos }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
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
            {item.enderecoCompleto || 'Endereço não informado'}
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      backdropColor={Colors.dark.backgroundSecondary}
      transparent={false}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => onClose()}>
          <Ionicons name="close-circle" size={32} color={Colors.dark.tint} />
        </TouchableOpacity>
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
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
    padding: 10, // Aumenta a área de toque
    zIndex: 10, // Garante que o botão fique acima do conteúdo
  },
});
