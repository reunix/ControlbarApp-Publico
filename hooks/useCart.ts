import { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { saveCartLocally, loadCartLocally } from '../services/storage';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const storedCart = await loadCartLocally();
      if (storedCart) setCart(storedCart);
    };
    load();
  }, []);

  useEffect(() => {
    saveCartLocally(cart);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const total = cart.reduce((sum, item) => sum + item.valor * item.quantity, 0);

  return { cart, addToCart, removeFromCart, total };
};