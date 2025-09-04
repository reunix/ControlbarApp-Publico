import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (cpf: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (cpf: string) => {
    try {
      await AsyncStorage.setItem("token", cpf);
      setIsAuthenticated(true);
      console.log("Login realizado, isAuthenticated:", true);
    } catch (error) {
      console.error("Erro ao salvar token no AsyncStorage:", error);
      throw new Error("Falha ao salvar credenciais");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setIsAuthenticated(false);
      console.log("Logout realizado, isAuthenticated:", false);
    } catch (error) {
      console.error("Erro ao limpar AsyncStorage:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
