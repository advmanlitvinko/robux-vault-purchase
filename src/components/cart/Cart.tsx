import { useState } from 'react';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface CartProps {
  onCheckout: (items: any[]) => void;
}

export function Cart({ onCheckout }: CartProps) {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const totalItems = getTotalItems();

  if (totalItems === 0) {
    return null;
  }

  const handleCheckout = () => {
    onCheckout(items);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Корзина ({totalItems})</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <img 
                src={item.image} 
                alt={item.displayName}
                className="w-12 h-12 object-cover rounded"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.displayName}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 ml-2"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center font-semibold">
              <span>Итого:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            
            <Button 
              onClick={handleCheckout}
              className="w-full"
              size="lg"
            >
              Оформить заказ
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}