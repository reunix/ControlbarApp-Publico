import { showToast } from "@/components/toast";

export interface ValidationResult {
  success: boolean;
  message: string;
}

export const validateEmail = (email: string): any => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast({
      type: "error",
      text1: "Erro",
      text2: "Por favor, insira um e-mail válido",
    });
    return false
  }
  return  true
};

export const validateCpf = (cpf: string): any => {
  const cleanedCpf = cpf.replace(/[^\d]/g, '');
  if (!/^\d{11}$/.test(cleanedCpf)) {
    showToast({
      type: "error",
      text1: "Erro",
      text2: "CPF inválido",
    });
    return false;
  }
  return true
};

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};