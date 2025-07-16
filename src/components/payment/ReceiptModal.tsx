import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, CheckCircle } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'robux' | 'pet';
  amount?: number;
  image?: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  price: number;
  nickname: string;
  isPet?: boolean;
  petName?: string;
  cartItems?: CartItem[];
}

export function ReceiptModal({ 
  isOpen, 
  onClose, 
  amount, 
  price, 
  nickname, 
  isPet = false, 
  petName, 
  cartItems 
}: ReceiptModalProps) {
  const transactionId = Math.random().toString(36).substr(2, 9).toUpperCase();
  const cardNumber = "**** **** **** 1234";
  const currentDate = new Date().toLocaleString('ru-RU');

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Чек об оплате
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Заголовок чека */}
          <div className="text-center border-b pb-4">
            <h3 className="text-lg font-bold">ROBUY</h3>
            <p className="text-sm text-muted-foreground">Интернет-магазин Robux</p>
            <p className="text-sm text-muted-foreground">{currentDate}</p>
          </div>

          {/* Детали покупки */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Никнейм:</span>
              <span className="font-medium">{nickname}</span>
            </div>
            
            <div className="border-t border-b border-dashed py-3 space-y-2">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between">
                      <span>Товар:</span>
                      <span className="font-medium">
                        {item.type === 'pet' ? item.name : `${formatAmount(item.amount || 0)} Robux`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Количество:</span>
                      <span className="font-medium">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Цена:</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    {cartItems.length > 1 && item !== cartItems[cartItems.length - 1] && (
                      <div className="border-b border-dashed my-2"></div>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Товар:</span>
                    <span className="font-medium">
                      {isPet ? petName : `${formatAmount(amount)} Robux`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Количество:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Цена:</span>
                    <span className="font-medium">{formatPrice(price)}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-between">
              <span>Способ оплаты:</span>
              <span className="font-medium">Банковская карта</span>
            </div>
            
            <div className="flex justify-between">
              <span>Номер карты:</span>
              <span className="font-medium">{cardNumber}</span>
            </div>
            
            <div className="flex justify-between">
              <span>ID транзакции:</span>
              <span className="font-medium">{transactionId}</span>
            </div>
          </div>

          {/* Итого */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Итого:</span>
              <span className="text-primary">{formatPrice(price)}</span>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Закрыть
            </Button>
            <Button 
              onClick={() => window.print()} 
              variant="default" 
              className="flex-1"
            >
              Распечатать чек
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}