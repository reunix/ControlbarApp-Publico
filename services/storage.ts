import { ProdutoParamsAppVendasPublico } from '@/types/RespostaParamsAppVendasPublico';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../types';

const PRODUCTS_KEY = '@app:products';
const CART_KEY = '@app:cart';

export const saveProductsLocally = async (products: ProdutoParamsAppVendasPublico[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Falha ao salvar produtos', error);
  }
};

export const loadProductsLocally = async (): Promise<ProdutoParamsAppVendasPublico[] | null> => {
  try {
    const stored = await AsyncStorage.getItem(PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Falha ao carregar produtos', error);
    return null;
  }
};

export const saveCartLocally = async (cart: CartItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Falha ao salvar carrinho', error);
  }
};

export const loadCartLocally = async (): Promise<CartItem[] | null> => {
  try {
    const stored = await AsyncStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Falha ao carregar carrinho', error);
    return null;
  }
};