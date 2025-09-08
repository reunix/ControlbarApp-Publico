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


export const validateCpf = (cpf: string): boolean => {
  const cleanedCpf = cpf.replace(/[^\d]/g, '');
  if (!/^\d{11}$/.test(cleanedCpf)) return false;

  // Elimina CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanedCpf)) return false;

  const digits = cleanedCpf.split('').map(Number);

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let firstVerifier = (sum * 10) % 11;
  if (firstVerifier === 10) firstVerifier = 0;
  if (firstVerifier !== digits[9]) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  let secondVerifier = (sum * 10) % 11;
  if (secondVerifier === 10) secondVerifier = 0;
  if (secondVerifier !== digits[10]) return false;

  return true;
};

// export const validateCpf = (cpf: string): any => {
//   const cleanedCpf = cpf.replace(/[^\d]/g, '');
//   if (!/^\d{11}$/.test(cleanedCpf)) {
//     showToast({
//       type: "error",
//       text1: "Erro",
//       text2: "CPF inválido",
//     });
//     return false;
//   }
//   return true
// };

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};