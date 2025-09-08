import { ProdutoParamsAppVendasPublico } from '@/types/RespostaParamsAppVendasPublico';
import { UpdateUser } from '@/types/UpdateUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../types';

const PRODUCTS_KEY = '@app:products';
const CART_KEY = '@app:cart';
const USER_KEY = '@app:user';

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

export const saveUserLocally = async (products: UpdateUser): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Falha ao salvar usuário', error);
  }
};

export const loadUserLocally = async (): Promise<UpdateUser | null> => {
  try {
    const stored = await AsyncStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Falha ao carregar usuário', error);
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