import { fetchApi } from './api-config';
import { validateCpf } from './utils';

export const login = async (cpf: string,senha:string): Promise<{ success: boolean; message?: string }> => {
  try {


    if (!validateCpf(cpf)) {
      return { success: false, message: 'CPF inválido. Deve conter 11 dígitos.' };
    }

    const response = await fetchApi<any>('/autenticacao/app-publico', {
         method: 'POST',
         body: JSON.stringify({
          cpf: cpf.toString(),
          senha: senha.toString(),
         })
       })

    return { success: response.success, message: response.message };
  } catch (error) {
    console.log('error' ,error)
    return { success: false, message: (error as any).response?.data?.error || 'Falha no login' };
  }
};


export const sendEmailChangePassword = async (email: string, generatedCode:string): Promise<{ success: boolean; message?: string }> => {
  try {

    const response = await fetchApi<any>('/autenticacao/send-email-change-password-app-publico', {
         method: 'POST',
         body: JSON.stringify({
          email: email.toString(),
          codigo: generatedCode.toString(),
         })
       })

    return { success: response.success, message: response.message };
  } catch (error) {
    console.log('error' ,error)
    return { success: false, message: (error as any).response?.data?.error || 'Falha no envio' };
  }
};


export const registerUser = async (
  form: {
    nome: string;
    email: string;
    senha: string;
    estado: string;
    cpf: string;
    cep: string;
    endereco: string;
    complemento: string;
    cidade: string;
    bairro: string;
    numero: string;
    ddd: string;
    telefone: string;
  }
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetchApi<any>('/autenticacao/addupdate/', {
      method: 'PUT',
      body: JSON.stringify(form), 
    });

    return { success: true, message: response.data.message || 'Cadastro realizado com sucesso' };
  } catch (error) {
    const errorMessage = (error as any).response?.data?.error || 'Falha ao realizar cadastro';
    console.error('Erro na requisição de cadastro:', error);
    return { success: false, message: errorMessage };
  }
};