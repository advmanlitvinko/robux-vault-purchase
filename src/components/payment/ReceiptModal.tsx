import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Calendar, User } from "lucide-react";
import { CartItem } from '@/hooks/useCart';

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
  const cardNumber = "**** **** **** 4256";
  const currentDate = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

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
              {cartItems ? (
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
                  
                  {!isPet && (
                    <div className="flex justify-between">
                      <span>Количество:</span>
                      <span className="font-medium">{formatAmount(amount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Цена:</span>
                    <span className="font-medium">{formatPrice(price)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Информация об оплате */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span>Карта Сбербанка:</span>
                <span className="font-medium">{cardNumber}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Дата транзакции:</span>
                <span className="font-medium">{currentDate}</span>
              </div>
            </div>

            {/* Итого */}
            <div className="border-t border-dashed pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>ИТОГО:</span>
                <span>{formatPrice(price)}</span>
              </div>
            </div>

            {/* Статус */}
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Оплата успешно завершена</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                ID транзакции: {transactionId}
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Закрыть
            </Button>
            <Button 
              variant="default" 
              onClick={() => window.print()}
              className="flex-1"
            >
              Печать чека
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}