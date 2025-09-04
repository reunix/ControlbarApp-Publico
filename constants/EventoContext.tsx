import React, { createContext, useContext, useState, ReactNode } from "react";
import { EventosAbertos } from "@/types/RespostaEventosAbertos";

interface EventoContextType {
  eventoSelecionado: EventosAbertos | null;
  setEventoSelecionado: (evento: EventosAbertos | null) => void;
}

const EventoContext = createContext<EventoContextType | undefined>(undefined);

export const EventoProvider = ({ children }: { children: ReactNode }) => {
  const [eventoSelecionado, setEventoSelecionado] = useState<EventosAbertos | null>(null);

  return (
    <EventoContext.Provider value={{ eventoSelecionado, setEventoSelecionado }}>
      {children}
    </EventoContext.Provider>
  );
};
 
export const useEvento = () => {
  const context = useContext(EventoContext);
  if (!context) {
    throw new Error("useEvento deve ser usado dentro de um EventoProvider");
  }
  return context;
};