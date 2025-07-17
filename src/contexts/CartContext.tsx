import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  displayName: string;
  price: number;
  image: string;
  quantity: number;
  type: 'pet' | 'robux';
  amount?: number; // for robux items
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  quickBuyItem: CartItem | null;
  setQuickBuyItem: (item: CartItem | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [quickBuyItem, setQuickBuyItem] = useState<CartItem | null>(null);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      if (existingItem) {
        // При увеличении количества существующего товара, убираем quickBuy окно
        setQuickBuyItem(null);
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // При добавлении нового товара
      const itemWithImage = {
        ...newItem,
        image: newItem.type === 'robux' ? 'https://i.imgur.com/MTv7K4H.png' : newItem.image,
        quantity: 1
      };
      
      // Если это первый товар в корзине, показываем quickBuy окно
      if (prev.length === 0) {
        setQuickBuyItem(itemWithImage);
      } else {
        // Если уже есть товары в корзине, скрываем quickBuy окно
        setQuickBuyItem(null);
      }
      
      return [...prev, itemWithImage];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      // Если удаляем товар и корзина становится пустой, убираем quickBuy окно
      if (newItems.length === 0) {
        setQuickBuyItem(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => {
      const newItems = prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      // Если изменяем количество и остался только один тип товара, обновляем quickBuy
      if (newItems.length === 1) {
        setQuickBuyItem(newItems[0]);
      } else {
        // Если несколько разных товаров, убираем quickBuy окно
        setQuickBuyItem(null);
      }
      
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    setQuickBuyItem(null);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      quickBuyItem,
      setQuickBuyItem
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}