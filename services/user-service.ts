import { UpdateUser } from '@/types/UpdateUser';
import { fetchApi } from './api-config';
import { validateCpf } from './utils';

export const login = async (cpf: string,senha:string): Promise<UpdateUser> => {
  try {


    if (!validateCpf(cpf)) {
      throw 'CPF inválido. Verifique e tente novamente.' ;
    }

    const dataUserResponse = await fetchApi<any>('/autenticacao/login-app-publico', {
         method: 'POST',
         body: JSON.stringify({
          cpf: cpf.toString(),
          senha: senha.toString(),
         })
       })

    return dataUserResponse
  } catch (error) {
    
    console.log('error' ,error)
    throw error || 'Falha no login' ;
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
    return { success: false, message: (error as any).response?.data?.error  || 'Falha no envio' };
  }
};

export const sendEmailNewUser = async (email: string, generatedCode:string, nomeUser:string): Promise<{ success: boolean; message?: string }> => {
  try {

    const response = await fetchApi<any>('/autenticacao/send-email-new-user-app-publico', {
         method: 'POST',
         body: JSON.stringify({
          email: email.toString(),
          codigo: generatedCode.toString(),
          nome: nomeUser.toString(),
         })
       })

    return { success: response.success, message: response.message };
  } catch (error) {
    console.log('error' ,error)
    return { success: false, message: (error as any).response?.data?.error  || 'Falha no envio' };
  }
};


export const getUserPorEmail = async (email: string): Promise<UpdateUser> => {
  try {

    const response = await fetchApi<any>(`/autenticacao/get-user-por-email?email=${email}`, {method: 'GET'})

    return response;
  } catch (error) {
    console.log('error' ,error)
    throw "Erro ao pegar dados do usuário"
  }
};

// export const registerUser = async (
//   form: {
//     nome: string;
//     email: string;
//     senha: string;
//     estado: string;
//     cpf: string;
//     cep: string;
//     endereco: string;
//     complemento: string;
//     cidade: string;
//     bairro: string;
//     numero: string;
//     ddd: string;
//     telefone: string;
//   }
// ): Promise<{ success: boolean; message?: string }> => {
//   try {
//     const response = await fetchApi<any>('/autenticacao/addupdate/', {
//       method: 'PUT',
//       body: JSON.stringify(form), 
//     });

//     return { success: true, message: response.data.message || 'Cadastro realizado com sucesso' };
//   } catch (error) {
//     const errorMessage = (error as any).response?.data?.error || 'Falha ao realizar cadastro';
//     console.error('Erro na requisição de cadastro:', error);
//     return { success: false, message: errorMessage };
//   }
// };

export const updateUser = async (  form: UpdateUser): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetchApi<any>('/autenticacao/update-user-app-publico/', {
      method: 'PUT',
      body: JSON.stringify(form), 
    });

    return { success: true, message: response.message || 'Cadastro realizado com sucesso' };
  } catch (error) {
    const errorMessage = (error as any).response?.data?.error || 'Falha ao realizar cadastro';
    console.error('Erro na requisição de cadastro:', error);
    return { success: false, message: errorMessage };
  }
};

export const createUser = async (  form: UpdateUser): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetchApi<any>('/autenticacao/create-user-app-publico/', {
      method: 'POST',
      body: JSON.stringify(form), 
    });

    return { success: true, message: response.message || 'Cadastro realizado com sucesso' };
  } catch (error) {
    const errorMessage = (error as any).response?.data?.error || 'Falha ao realizar cadastro';
    console.error('Erro na requisição de cadastro:', error);
    return { success: false, message: errorMessage };
  }
};