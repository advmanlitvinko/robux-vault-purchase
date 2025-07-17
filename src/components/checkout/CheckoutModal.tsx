import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, CreditCard, Smartphone, ArrowLeft, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CartItem } from '@/contexts/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: (orderData: any) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'sbp',
    name: 'СБП (Система быстрых платежей)',
    icon: Smartphone,
    popular: true
  },
  {
    id: 'card',
    name: 'Банковская карта',
    icon: CreditCard,
    popular: false
  }
];

export function CheckoutModal({ isOpen, onClose, items, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<'nickname' | 'payment' | 'sbp-qr' | 'processing' | 'success'>('nickname');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showAllItems, setShowAllItems] = useState(false);
  const [isEmailMasked, setIsEmailMasked] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
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

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayment(paymentId);
    if (paymentId === 'sbp') {
      setStep('sbp-qr');
    } else {
      // Для банковской карты используем существующую логику
      setStep('processing');
      setTimeout(() => {
        handleOrderSuccess();
      }, 2000);
    }
  };

  const handleSBPPayment = () => {
    setStep('processing');
    setTimeout(() => {
      handleOrderSuccess();
    }, 2000);
  };

  const handleOrderSuccess = () => {
    // Сохраняем email в cookies
    if (email && !isEmailMasked) {
      setCookie('user_email', email);
    }

    const orderData = {
      nickname,
      email,
      items,
      totalPrice: getTotalPrice(),
      paymentMethod: selectedPayment
    };

    onSuccess(orderData);
    setStep('success');
  };

  const handleClose = () => {
    setStep('nickname');
    setNickname('');
    setEmail('');
    setSelectedPayment('');
    setShowAllItems(false);
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'nickname':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="nickname" className="text-base font-medium">
                Введите ваш игровой ник
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ваш ник в Roblox"
                className="mt-2"
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Ваш заказ:</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.displayName} className="w-10 h-10 rounded" />
                    <div>
                      <div className="font-medium">{item.displayName}</div>
                      <div className="text-sm text-muted-foreground">x{item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
              
              <div className="border-t pt-3 flex justify-between items-center font-semibold">
                <span>Итого:</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            <Button 
              onClick={handleNicknameSubmit} 
              className="w-full" 
              disabled={!nickname.trim()}
            >
              Продолжить
            </Button>
          </div>
        );

      case 'payment':
        return (
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

              {items.length > 1 && (
                <div className="border rounded p-3">
                  <button
                    onClick={() => setShowAllItems(!showAllItems)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="font-medium">
                      {showAllItems ? 'Скрыть товары' : `Показать все товары (${getTotalItems()})`}
                    </span>
                    {showAllItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {showAllItems && (
                    <div className="mt-3 space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.displayName} x{item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-3 flex justify-between items-center font-semibold">
                <span>Итого к оплате:</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Способ оплаты:</h3>
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentSelect(method.id)}
                    className="w-full p-4 border rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{method.name}</span>
                      {method.popular && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Популярно
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'sbp-qr':
        return (
          <div className="space-y-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setStep('payment')}
              className="mb-4 p-0 h-auto self-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>

            <div>
              <h3 className="text-lg font-semibold mb-2">Оплата через СБП</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Отсканируйте QR-код приложением банка, чтобы оплатить заказ
              </p>
            </div>

            <div className="flex justify-center">
              <div 
                className="p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                onClick={handleSBPPayment}
              >
                <QRCodeSVG 
                  value={`https://example.com/pay?order_id=${Date.now()}&amount=${getTotalPrice()}`}
                  size={200}
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Сумма к оплате: <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
            </div>

            <Button onClick={handleSBPPayment} variant="outline" className="w-full">
              Я оплатил
            </Button>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Обработка платежа...</h3>
              <p className="text-muted-foreground">Пожалуйста, подождите</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div>
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
              
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.displayName} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Итого:</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Чек отправлен на почту {email ? maskEmail(email) : 'указанную вами'}
            </p>

            <Button onClick={handleClose} className="w-full">
              Закрыть
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'nickname' && 'Оформление заказа'}
            {step === 'payment' && 'Способ оплаты'}
            {step === 'sbp-qr' && 'Оплата через СБП'}
            {step === 'processing' && 'Обработка платежа'}
            {step === 'success' && 'Заказ оформлен'}
          </DialogTitle>
        </DialogHeader>
        
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}