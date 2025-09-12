import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Smartphone, Wallet, Building, Loader2, QrCode, DollarSign, ArrowLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ReceiptModal } from './ReceiptModal';
import { useCart } from '@/contexts/CartContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'robux' | 'pet' | 'class';
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
  { id: 'sbp', name: 'СБП (Система быстрых платежей)', icon: QrCode, popular: true, emoji: '📱' },
  { id: 'card', name: 'Банковская карта', icon: CreditCard, popular: false, emoji: '💳' },
  { id: 'mobile', name: 'Мобильный платёж', icon: Smartphone, popular: false, emoji: '📱' },
  { id: 'yoomoney', name: 'ЮMoney', icon: Wallet, popular: false, emoji: '💰' },
  { id: 'paypal', name: 'PayPal', icon: DollarSign, popular: false, emoji: '🌍' },
];

export function PaymentModal({ isOpen, onClose, amount, price, isPet = false, petName, cartItems }: PaymentModalProps) {
  const { clearCart } = useCart();
  const [step, setStep] = useState<'nickname' | 'payment' | 'processing' | 'success' | 'qr'>('nickname');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isEmailMasked, setIsEmailMasked] = useState(true);

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

  // Загрузка email из cookies
  useEffect(() => {
    if (step === 'payment') {
      const savedEmail = getCookie('user_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setIsEmailMasked(true);
      }
    }
  }, [step]);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return '';
  };

  const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  };

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      setStep('payment');
    }
  };

  const handlePaymentSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (methodId === 'sbp') {
      setStep('qr');
    } else {
      setStep('processing');
      
      // Имитация обработки платежа
      setTimeout(() => {
        handleOrderSuccess();
      }, 3000);
    }
  };

  const handleQRPayment = () => {
    setStep('processing');
    
    // Имитация обработки платежа СБП
    setTimeout(() => {
      handleOrderSuccess();
    }, 2000);
  };

  const handleOrderSuccess = () => {
    // Сохраняем email в cookies
    if (email && !isEmailMasked) {
      setCookie('user_email', email);
    }
    
    // Очищаем корзину после успешной оплаты
    clearCart();
    setStep('success');
  };

  const handleClose = () => {
    setStep('nickname');
    setNickname('');
    setEmail('');
    setSelectedMethod(null);
    setShowReceipt(false);
    setIsEmailMasked(true);
    onClose();
  };

  // Сброс состояния при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setStep('nickname');
      setNickname('');
      setEmail('');
      setSelectedMethod(null);
      setShowReceipt(false);
      setIsEmailMasked(true);
    }
  }, [isOpen]);

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
          <div className="space-y-6">
            <div>
              <Label htmlFor="nickname" className="text-base font-medium">
                Введите ваш игровой ник
              </Label>
              <Input
                id="nickname"
                placeholder="Ваш никнейм в Roblox"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-2"
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
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setStep('nickname')}
              className="mb-4 p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>

            <div className="space-y-3">
              <div className="p-3 bg-muted rounded">
                <div className="text-sm text-muted-foreground">Игровой ник:</div>
                <div className="font-medium">{nickname}</div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email для получения чека
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={isEmailMasked && email ? maskEmail(email) : email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailMasked(false);
                  }}
                  onFocus={() => setIsEmailMasked(false)}
                  placeholder="ваш@email.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Способ оплаты:</h3>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method, index) => {
                  const Icon = method.icon;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentSelect(method.id)}
                      className="w-full p-4 border rounded-lg text-left transition-all duration-300 
                        animate-fade-in hover-scale relative overflow-hidden group
                        border-border hover:border-primary hover:shadow-md hover:bg-accent/50"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{method.emoji}</span>
                            <Icon className="w-5 h-5 transition-colors text-foreground group-hover:text-primary" />
                          </div>
                          <span className="font-medium transition-colors text-foreground">
                            {method.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {method.popular && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded animate-pulse">
                              Популярно
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Hover gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  );
                })}
              </div>
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

        {step === 'qr' && (
          <div className="text-center space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Оплата через СБП</h3>
              <p className="text-sm text-muted-foreground">
                Отсканируйте QR-код приложением банка, чтобы оплатить заказ
              </p>
            </div>
            
            <div className="flex justify-center">
              <div 
                className="p-4 bg-white rounded-lg border-2 border-dashed border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={handleQRPayment}
              >
                <QRCodeSVG 
                  value={`https://example.com/pay?order_id=${Date.now()}&amount=${price}`}
                  size={200}
                  level="M"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Сумма к оплате: <span className="font-semibold">{formatPrice(price)}</span>
              </p>
              <Button 
                onClick={handleQRPayment}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Я оплатил
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Оплата прошла успешно!
              </h3>
              <p className="text-muted-foreground">Спасибо за ваш заказ</p>
            </div>

            <div className="space-y-3 p-4 border rounded">
              <div className="text-sm">
                <span className="text-muted-foreground">Игровой ник: </span>
                <span className="font-medium">{nickname}</span>
              </div>
              
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.type === 'pet' ? item.name : `${formatAmount(item.amount || 0)} Robux`} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between text-sm">
                  <span>
                    {isPet ? petName : `${formatAmount(amount)} Robux`}
                  </span>
                  <span>{formatPrice(price)}</span>
                </div>
              )}
              
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Итого:</span>
                <span>{formatPrice(price)}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Чек отправлен на почту {email ? maskEmail(email) : 'указанную вами'}
            </p>

            <div className="space-y-2">
              <Button onClick={handleShowReceipt} variant="outline" className="w-full">
                Показать чек
              </Button>
              <Button onClick={handleBackToShop} className="w-full">
                Вернуться в магазин
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
      
      {/* Модальное окно чека */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={handleCloseReceipt}
        orderData={{
          nickname,
          email,
          items: cartItems || [{
            id: 'single-item',
            name: isPet ? petName : 'Robux',
            displayName: isPet ? petName : `${amount} Robux`,
            price,
            quantity: 1,
            type: isPet ? 'pet' : 'robux',
            amount: isPet ? undefined : amount
          }],
          totalPrice: price,
          paymentMethod: selectedMethod || 'card'
        }}
      />
    </Dialog>
  );
}