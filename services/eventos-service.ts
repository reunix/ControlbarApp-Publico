import { EventosAbertos } from '@/types/RespostaEventosAbertos';
import { fetchApi } from './api-config';

export const fetchEventosAbertos = async (): Promise<EventosAbertos[]> => {
  try {
    const response = await fetchApi<EventosAbertos[]>(   
      `/eventos/eventos-abertos-app-publico`,
      { method: 'GET' }

    );

    if (!response) {
      throw new Error('Nenhuma resposta recebida da API');
    }
    
    return response 
  } catch (error) {
    throw new Error('Falha ao buscar produtos ' + error);
  }
};  
