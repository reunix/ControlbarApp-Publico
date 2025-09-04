import { RespostaParamsAppVendasPublico } from '@/types/RespostaParamsAppVendasPublico';
import { fetchApi } from './api-config';

export const fetchProducts = async (idEvento: number): Promise<RespostaParamsAppVendasPublico> => {
  try {
    
    const response = await fetchApi<RespostaParamsAppVendasPublico>(  
      `/eventos/evento-params-app-publico/${idEvento}`,
      { method: 'GET' }

    );
    
    if (!response) {
      throw new Error('Nenhuma resposta recebida da API');
    }
    
    return response 
  } catch (error) {
    //  console.log('error:',error)
    throw new Error('Falha ao buscar produtos ' + error);
  }
};  


// export const fetchProductsForScreen = async (): Promise<RespostaParamsAppVendasPublico> => {
//   return await fetchProducts();
// }