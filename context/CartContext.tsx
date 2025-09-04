import React, { createContext, useContext, useEffect, useReducer } from "react";
import { loadCartLocally, saveCartLocally } from "../services/storage";
import { CartItem } from "../types";
import { ProdutoParamsAppVendasPublico } from "@/types/RespostaParamsAppVendasPublico";

type CartState = CartItem[];

type CartAction =
  | { type: "ADD_ITEM"; payload: ProdutoParamsAppVendasPublico }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "CLEAR_CART" }; // Nova ação

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((item) => item.idProduto === action.payload.idProduto);
      if (existing) {
        return state.map((item) =>
          item.idProduto === action.payload.idProduto
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM": {
      const existing = state.find((item) => item.idProduto === action.payload);
      if (existing && existing.quantity > 1) {
        return state.map((item) =>
          item.idProduto === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return state.filter((item) => item.idProduto !== action.payload);
    }

    case "LOAD_CART":
      return action.payload;
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

interface CartContextType {
  cart: CartState;
  addToCart: (product: ProdutoParamsAppVendasPublico) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void; 
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    const load = async () => {
      const storedCart = await loadCartLocally();
      if (storedCart) dispatch({ type: "LOAD_CART", payload: storedCart });
    };
    load();
  }, []);

  useEffect(() => {
    saveCartLocally(cart);
  }, [cart]);

  const addToCart = (product: ProdutoParamsAppVendasPublico) =>
    dispatch({ type: "ADD_ITEM", payload: product });
  const removeFromCart = (id: number) =>
    dispatch({ type: "REMOVE_ITEM", payload: id });

  const total = cart.reduce((sum, item) => sum + item.valorProduto * item.quantity, 0);
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
};
