import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingCart, Coins, Crown } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (total: number) => void;
}

export function CartModal({ isOpen, onClose, onCheckout }: CartModalProps) {
  const { state, dispatch } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleCheckout = () => {
    onCheckout(state.total);
    onClose();
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Корзина ({state.items.length})
          </DialogTitle>
        </DialogHeader>

        {state.items.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
            <p className="text-lg font-medium">Корзина пуста</p>
            <p className="text-sm text-muted-foreground">Добавьте товары для оформления заказа</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Список товаров */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card/50">
                  {/* Изображение или иконка */}
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {item.type === 'robux' ? (
                        <Coins className="w-6 h-6 text-primary" />
                      ) : (
                        <Crown className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatPrice(item.price)}</span>
                      {item.type === 'robux' && item.amount && (
                        <span>• {formatAmount(item.amount)} Robux</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Итого */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Итого:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(state.total)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Оформить заказ
                </Button>
                <Button 
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  Очистить корзину
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}