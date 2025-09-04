import { fetchApi } from './api-config';

export const login = async (cpf: string): Promise<{ success: boolean; message?: string }> => {
  try {

    const response = await fetchApi<any>('/login', {
         method: 'POST',
         body: JSON.stringify({
          cpf: cpf.toString(),
         })
       })

    // const response = await api.post('/login', { cpf });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: (error as any).response?.data?.error || 'Falha no login' };
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