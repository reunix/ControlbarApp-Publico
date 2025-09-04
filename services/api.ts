

// Mock de dados de produtos

import { ProdutoParamsAppVendasPublico } from "@/types/RespostaParamsAppVendasPublico";

const mockProducts: ProdutoParamsAppVendasPublico[] = [
  { idProduto: 1, nomeProduto: 'AGUA COCO COPO 300ML', grupoProduto: 'Gelados', valorProduto: 29.90, imagemProduto: '../../assets/images/products/camiseta_basica.jpg' },
  { idProduto: 2, nomeProduto: 'AGUA COM GAS', grupoProduto: 'Gelados', valorProduto: 89.90, imagemProduto: '../../assets/images/products/calca_jeans.jpg' },
  { idProduto: 3, nomeProduto: 'AGUA MINERAL', grupoProduto: 'Gelados', valorProduto: 149.90, imagemProduto: '../../assets/images/products/jaqueta.jpg' },
  { idProduto: 4, nomeProduto: 'AGUA TONICA', grupoProduto: 'Gelados', valorProduto: 29.90, imagemProduto: '../../assets/images/products/camiseta_basica.jpg' },
  { idProduto: 5, nomeProduto: 'COPO DE SUCO', grupoProduto: 'Gelados', valorProduto: 89.90, imagemProduto: '../../assets/images/products/calca_jeans.jpg' },
  { idProduto: 6, nomeProduto: 'ENERGETICO', grupoProduto: 'Gelados', valorProduto: 149.90, imagemProduto: '../../assets/images/products/jaqueta.jpg' },
  { idProduto: 7, nomeProduto: 'MONSTER 269ML', grupoProduto: 'Gelados', valorProduto: 29.90, imagemProduto: '../../assets/images/products/camiseta_basica.jpg' },
  { idProduto: 8, nomeProduto: 'SUCO LARANJA', grupoProduto: 'Gelados', valorProduto: 89.90, imagemProduto: '../../assets/images/products/calca_jeans.jpg' },
  { idProduto: 9, nomeProduto: 'SUCO LIMAO', grupoProduto: 'Gelados', valorProduto: 149.90, imagemProduto: '../../assets/images/products/jaqueta.jpg' },
  { idProduto: 10, nomeProduto: 'COCA-COLA - LATA', grupoProduto: 'Gelados', valorProduto: 149.90, imagemProduto: '../../assets/images/products/jaqueta.jpg' },
  { idProduto: 11, nomeProduto: 'FANTA - LATA', grupoProduto: 'Gelados', valorProduto: 149.90, imagemProduto: '../../assets/images/products/jaqueta.jpg' },
  { idProduto: 12, nomeProduto: 'FANTA UVA -LATA', grupoProduto: 'Gelados', valorProduto: 149.90, imagemProduto: '../../assets/images/products/jaqueta.jpg' },
  
  { idProduto: 13, nomeProduto: 'CAIPIFRUTA ZERO ALCOOL', grupoProduto: 'Drinks', valorProduto: 129.90, imagemProduto: '../../assets/images/products/tenis_esportivo.jpg' },
  { idProduto: 14, nomeProduto: 'CAIPIGOLD', grupoProduto: 'Drinks', valorProduto: 49.90, imagemProduto: '../../assets/images/products/sandalia.jpg' },
  { idProduto: 15, nomeProduto: 'CAIPIRINHA', grupoProduto: 'Drinks', valorProduto: 49.90, imagemProduto: '../../assets/images/products/sandalia.jpg' },
  { idProduto: 16, nomeProduto: 'CAIPIRINHA BANININHA', grupoProduto: 'Drinks', valorProduto: 49.90, imagemProduto: '../../assets/images/products/sandalia.jpg' },
  { idProduto: 17, nomeProduto: 'COSMOPOLITAN', grupoProduto: 'Drinks', valorProduto: 49.90, imagemProduto: '../../assets/images/products/sandalia.jpg' },
  { idProduto: 18, nomeProduto: 'CAIPIROSKA SMIRNOFF', grupoProduto: 'Drinks', valorProduto: 49.90, imagemProduto: '../../assets/images/products/sandalia.jpg' },

  { idProduto: 19, nomeProduto: 'ABSOLUT', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  { idProduto: 20, nomeProduto: 'SMIRNOFF', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  { idProduto: 21, nomeProduto: 'BACARDI', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  { idProduto: 22, nomeProduto: 'BANANINHAZINHA', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  { idProduto: 23, nomeProduto: 'BLACK WHITE', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  { idProduto: 24, nomeProduto: 'CACHAÇA', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },

  { idProduto: 25, nomeProduto: 'GIN GORDONS', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  { idProduto: 26, nomeProduto: 'JACK DANIELS APPLE', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  { idProduto: 27, nomeProduto: 'GIN TANQUERAY', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  { idProduto: 28, nomeProduto: 'PITU', grupoProduto: 'Garrafas', valorProduto: 19.90, imagemProduto: '../../assets/images/products/bone.jpg' },
  
  { idProduto: 29, nomeProduto: 'BUDWEISER 600ML', grupoProduto: 'Cervejas', valorProduto: 9.90, imagemProduto: '../../assets/images/products/budweiser_600ml.jpg' },
  { idProduto: 30, nomeProduto: 'CORONA LONG NECK', grupoProduto: 'Cervejas', valorProduto: 8.90, imagemProduto: '../../assets/images/products/corona_long_neck.jpg' },
  { idProduto: 31, nomeProduto: 'ORIGINAL 600ML', grupoProduto: 'Cervejas', valorProduto: 11.90, imagemProduto: '../../assets/images/products/original_600ml.jpg' },
  { idProduto: 32, nomeProduto: 'SPATEN LONG NECK', grupoProduto: 'Cervejas', valorProduto: 12.90, imagemProduto: '../../assets/images/products/spaten_long_neck.jpg' },
  { idProduto: 33, nomeProduto: 'STELLA ARTOIS 600ML', grupoProduto: 'Cervejas', valorProduto: 4.90, imagemProduto: '../../assets/images/products/stella_600ml.jpg' },
  { idProduto: 34, nomeProduto: 'STELLA ARTOIS LONG NECK', grupoProduto: 'Cervejas', valorProduto: 49.90, imagemProduto: '../../assets/images/products/stella_long_neck.jpg' },

  { idProduto: 35, nomeProduto: 'CALDINHO FEIJAO', grupoProduto: 'Comidas', valorProduto: 9.90, imagemProduto: '../../assets/images/products/budweiser_600ml.jpg' },
  { idProduto: 36, nomeProduto: 'CALDINHO PEIXE', grupoProduto: 'Comidas', valorProduto: 8.90, imagemProduto: '../../assets/images/products/corona_long_neck.jpg' },
  { idProduto: 37, nomeProduto: 'ORIGINAL 600ML', grupoProduto: 'Comidas', valorProduto: 11.90, imagemProduto: '../../assets/images/products/original_600ml.jpg' },
  { idProduto: 38, nomeProduto: 'COMBO 10 SALGADOS', grupoProduto: 'Comidas', valorProduto: 12.90, imagemProduto: '../../assets/images/products/spaten_long_neck.jpg' },
  { idProduto: 39, nomeProduto: 'MACAXEIRA COM CHARQUE', grupoProduto: 'Comidas', valorProduto: 4.90, imagemProduto: '../../assets/images/products/stella_600ml.jpg' },
  { idProduto: 40, nomeProduto: 'BATA FRITA', grupoProduto: 'Comidas', valorProduto: 49.90, imagemProduto: '../../assets/images/products/stella_long_neck.jpg' },

];

// Função para simular um delay (como se fosse uma chamada de API)
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (cpf: string, senha:string): Promise<{ success: boolean; message?: string }> => {
  await simulateDelay(); // Simula latência de 500ms
  try {
    // Simula validação de CPF (exemplo: aceita qualquer CPF com 11 dígitos)
    const isValidCpf = /^\d{11}$/.test(cpf);
    if (isValidCpf) {
      return { success: true, message: 'Login realizado com sucesso' };
    } else {
      return { success: false, message: 'CPF inválido. Deve conter 11 dígitos.' };
    }
  } catch (error) {
    return { success: false, message: 'Falha no login '+error };
  }
};

export const fetchProducts = async (): Promise<ProdutoParamsAppVendasPublico[]> => {
  await simulateDelay(); // Simula latência de 500ms
  try {
    return mockProducts; // Retorna a lista de produtos mockada
  } catch (error) {
    throw new Error('Falha ao buscar produtos '+error);
  }
};