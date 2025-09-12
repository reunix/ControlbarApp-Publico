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
  eventosPorLocalizacao: boolean;
  eventos: EventosAbertos[];
  onSelect: (evento: EventosAbertos) => void;
  onClose: () => void;
};

export default function SelectEvento({
  visible,
  eventosPorLocalizacao,
  eventos,
  onSelect,
  onClose,
}: SelectEventoProps) {
  const [isModalReady, setIsModalReady] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsModalReady(false);

      setTimeout(() => setIsModalReady(true), 100);
    } else {
      setIsModalReady(false);
    }
  }, [visible]);

  const handleSelect = (item: EventosAbertos) => {
    onSelect(item);
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
          <ThemedText style={styles.textData}>{item.dataEvento}</ThemedText>
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

  if (!isModalReady) return null; 

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.topo}>

          <View style={styles.tituloContainer}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <ThemedText style={styles.titulo}>SELECIONE O EVENTO</ThemedText>
            </View>

            <TouchableOpacity style={{ marginRight: 17 }} onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={32}
                color={Colors.dark.tint}
              />
            </TouchableOpacity>
          </View>
        </View>

        {eventos.length > 1 && (
          <ThemedText style={styles.mensagem}>
            {eventosPorLocalizacao
              ? "ℹ️ Há mais de um evento por perto.\nEscolha com atenção! 😊"
              : // : "⚠️ Não há eventos próximos de você no momento.\nConfira todos os eventos disponíveis e escolha com atenção."}
                "ℹ️ Nenhum evento próximo.\nConfira todos os eventos disponíveis abaixo.\n⚠️ Escolha com atenção."}
          </ThemedText>
        )}

        <View style={styles.listaContainer}>
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
    color: Colors.dark.tint,
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
  textData: {
    color: Colors.dark.tint,
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
  topo: {
    width: "100%",
    marginBottom: 10,
  },
  mensagem: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 15,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  tituloContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  titulo: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 20,
  },
  listaContainer: {
    flex: 1,
    width: "99%",
    maxHeight: "90%",
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
  },
});
