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
                <Card key={item.id} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.type === 'robux' ? (
                          <Coins className="w-8 h-8 text-primary" />
                        ) : (
                          <Crown className="w-8 h-8 text-primary" />
                        )}
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          {item.type === 'robux' && item.amount && (
                            <p className="text-sm text-muted-foreground">
                              {formatAmount(item.amount)} Robux
                            </p>
                          )}
                          <p className="text-sm text-primary font-medium">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Управление количеством */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Удалить товар */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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