import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'robux' | 'pet';
  amount?: number; // для robux
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CART_STORAGE_KEY = 'cart-items';

const saveCartToStorage = (state: CartState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const loadCartFromStorage = (): CartState => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return { items: [], total: 0 };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        newState = {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      }
      break;
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== action.payload.id);
        newState = {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      } else {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
        newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      }
      break;
    }
    
    case 'CLEAR_CART': {
      newState = {
        items: [],
        total: 0
      };
      break;
    }

    case 'LOAD_CART': {
      return action.payload;
    }
    
    default:
      return state;
  }

  // Сохраняем в localStorage после каждого изменения
  saveCartToStorage(newState);
  return newState;
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  // Загружаем корзину из localStorage при инициализации
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    dispatch({ type: 'LOAD_CART', payload: savedCart });
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};