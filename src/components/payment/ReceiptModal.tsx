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
  orderData: any;
}

export function ReceiptModal({ 
  isOpen, 
  onClose, 
  orderData
}: ReceiptModalProps) {
  if (!orderData) return null;

  const transactionId = Math.random().toString(36).substr(2, 9).toUpperCase();
  const currentDate = new Date().toLocaleString('ru-RU');
  
  // Разные концовки карт для разных способов оплаты
  const getCardNumber = (paymentMethod: string) => {
    const cardEndings = {
      'card': '**** **** **** 4256',
      'sbp': '**** **** **** 3312', 
      'mobile': '**** **** **** 7891',
      'yoomoney': '**** **** **** 5642',
      'paypal': '**** **** **** 9107'
    };
    return cardEndings[paymentMethod as keyof typeof cardEndings] || '**** **** **** 4256';
  };

  const cardNumber = getCardNumber(orderData.paymentMethod);

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
              <span className="font-medium">{orderData.nickname}</span>
            </div>
            
            <div className="border-t border-b border-dashed py-3 space-y-2">
              {orderData.items.map((item: any) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between">
                    <span>Товар:</span>
                    <span className="font-medium">
                      {item.type === 'pet' ? item.displayName : `${formatAmount(item.amount || 0)} Robux`}
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
                  {orderData.items.length > 1 && item !== orderData.items[orderData.items.length - 1] && (
                    <div className="border-b border-dashed my-2"></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <span>Способ оплаты:</span>
              <span className="font-medium">
                {orderData.paymentMethod === 'sbp' ? 'СБП' : 
                 orderData.paymentMethod === 'card' ? 'Банковская карта' :
                 orderData.paymentMethod === 'mobile' ? 'Мобильный платёж' :
                 orderData.paymentMethod === 'yoomoney' ? 'ЮMoney' :
                 orderData.paymentMethod === 'paypal' ? 'PayPal' : 'Банковская карта'}
              </span>
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
              <span className="text-primary">{formatPrice(orderData.totalPrice)}</span>
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