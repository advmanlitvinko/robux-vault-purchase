import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Smartphone, Wallet, Building, Loader2 } from "lucide-react";
import { ReceiptModal } from './ReceiptModal';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'robux' | 'pet';
  amount?: number;
  image?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  price: number;
  isPet?: boolean;
  petName?: string;
  cartItems?: CartItem[];
}

const PAYMENT_METHODS = [
  { id: 'card', name: 'Банковская карта', icon: CreditCard, popular: true },
  { id: 'sbp', name: 'СБП', icon: Smartphone, popular: true },
  { id: 'yoomoney', name: 'ЮMoney', icon: Wallet, popular: false },
  { id: 'qiwi', name: 'QIWI', icon: Building, popular: false },
];

export function PaymentModal({ isOpen, onClose, amount, price, isPet = false, petName, cartItems }: PaymentModalProps) {
  const [step, setStep] = useState<'nickname' | 'payment' | 'processing' | 'success'>('nickname');
  const [nickname, setNickname] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

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

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      setStep('payment');
    }
  };

  const handlePaymentSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('processing');
    
    // Имитация обработки платежа
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const handleClose = () => {
    setStep('nickname');
    setNickname('');
    setSelectedMethod(null);
    setShowReceipt(false);
    onClose();
  };

  const handleBackToShop = () => {
    handleClose();
  };

  const handleShowReceipt = () => {
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            💳 Оплата {cartItems && cartItems.length > 0 ? (
              cartItems.length === 1 
                ? cartItems[0].type === 'pet' 
                  ? cartItems[0].name 
                  : `${formatAmount(cartItems[0].amount || 0)} Robux`
                : `${cartItems.length} товар${cartItems.length > 1 ? 'ов' : ''}`
            ) : (isPet ? petName : `${formatAmount(amount)} Robux`)}
          </DialogTitle>
          <DialogDescription>
            {cartItems && cartItems.length > 0 ? (
              <div className="space-y-1">
                 {cartItems.map((item) => (
                   <div key={item.id} className="text-sm">
                     {item.type === 'pet' ? item.name : `${formatAmount(item.amount || 0)} Robux`} {item.quantity > 1 && `(${item.quantity}x)`} - {formatPrice(item.price * item.quantity)}
                   </div>
                 ))}
                 <div className="font-medium mt-2">Итого: {formatPrice(price)}</div>
              </div>
            ) : (
              `Сумма к оплате: ${formatPrice(price)}`
            )}
          </DialogDescription>
        </DialogHeader>

        {step === 'nickname' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Введите ваш Roblox-ник</label>
              <Input
                placeholder="Ваш никнейм в Roblox"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleNicknameSubmit} 
              disabled={!nickname.trim()}
              className="w-full"
            >
              Продолжить
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Выберите способ оплаты:
            </p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <Card 
                    key={method.id}
                    className="cursor-pointer hover:bg-accent transition-colors relative"
                    onClick={() => handlePaymentSelect(method.id)}
                  >
                    {method.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
                        Популярный
                      </Badge>
                    )}
                    <CardContent className="p-4 flex items-center gap-3">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="font-medium">{method.name}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center space-y-4 py-8">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <div>
              <p className="font-medium">Обработка платежа...</p>
              <p className="text-sm text-muted-foreground">Пожалуйста, подождите</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-16 h-16 text-success mx-auto" />
            <div className="space-y-2">
              <p className="text-lg font-bold text-success">
                ✅ Оплата прошла успешно!
              </p>
              <p className="text-sm">
                {cartItems && cartItems.length > 0 ? (
                  <div className="space-y-1">
                    {cartItems.map((item) => (
                      <div key={item.id}>
                        {item.type === 'pet' 
                          ? `${item.name} ${item.quantity > 1 ? `(${item.quantity}x) ` : ''}был(а) отправлен(а) на аккаунт "${nickname}"` 
                          : `${formatAmount(item.amount || 0)} Robux ${item.quantity > 1 ? `(${item.quantity}x) ` : ''}были зачислены на аккаунт "${nickname}"`
                        }
                      </div>
                    ))}
                  </div>
                ) : (
                  isPet ? `${petName} был(а) отправлен(а) на аккаунт "${nickname}"` : `${formatAmount(amount)} Robux были зачислены на аккаунт "${nickname}"`
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                ⏱ Проверка может занять до 30 минут
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={handleBackToShop} className="w-full">
                Вернуться в магазин
              </Button>
              <Button variant="outline" className="w-full" onClick={handleShowReceipt}>
                Показать чек
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
      
      {/* Модальное окно чека */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={handleCloseReceipt}
        amount={amount}
        price={price}
        nickname={nickname}
        isPet={isPet}
        petName={petName}
        cartItems={cartItems}
      />
    </Dialog>
  );
}