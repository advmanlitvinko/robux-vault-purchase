import { useState, useRef } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Header } from '@/components/navigation/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { RobuxCalculator } from '@/components/robux/RobuxCalculator';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { PetsSection } from '@/components/pets/PetsSection';
import { InstructionsSection } from '@/components/sections/InstructionsSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { SupportSection } from '@/components/sections/SupportSection';
import { CartProvider } from '@/hooks/useCart';
import { CartModal } from '@/components/cart/CartModal';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    amount: number;
    price: number;
    isPet?: boolean;
    petName?: string;
  }>({
    isOpen: false,
    amount: 0,
    price: 0,
    isPet: false,
    petName: ''
  });

  const [cartModal, setCartModal] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBuy = (amount: number, price: number) => {
    setPaymentModal({
      isOpen: true,
      amount,
      price,
      isPet: false,
      petName: ''
    });
  };

  const handleBuyPet = (petName: string, price: number) => {
    setPaymentModal({
      isOpen: true,
      amount: 0,
      price,
      isPet: true,
      petName
    });
  };

  const handleClosePayment = () => {
    setPaymentModal({
      isOpen: false,
      amount: 0,
      price: 0,
      isPet: false,
      petName: ''
    });
  };

  const handleCartCheckout = (total: number) => {
    setPaymentModal({
      isOpen: true,
      amount: 0,
      price: total,
      isPet: false,
      petName: ''
    });
  };

  const handleOpenCart = () => {
    setCartModal(true);
  };

  return (
    <AuthGuard>
      <CartProvider>
        <div className="min-h-screen bg-background">
          {/* Шапка с навигацией */}
          <Header onCartCheckout={handleCartCheckout} onOpenCart={handleOpenCart} />
        
        {/* Hero секция */}
        <HeroSection onGetStarted={handleGetStarted} />

        {/* Калькулятор Robux */}
        <section ref={calculatorRef} className="py-20 px-4" id="buy">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Выберите количество Robux
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Настройте нужное количество или выберите готовый пакет
              </p>
            </div>
            <RobuxCalculator onBuy={handleBuy} onOpenCart={handleOpenCart} />
          </div>
        </section>

        {/* Питомцы */}
        <PetsSection onBuyPet={handleBuyPet} />

        {/* Инструкция */}
        <div id="instructions">
          <InstructionsSection />
        </div>

        {/* Отзывы */}
        <div id="reviews">
          <ReviewsSection />
        </div>

        {/* Поддержка */}
        <div id="support">
          <SupportSection />
        </div>

          {/* Модальное окно оплаты */}
          <PaymentModal
            isOpen={paymentModal.isOpen}
            onClose={handleClosePayment}
            amount={paymentModal.amount}
            price={paymentModal.price}
            isPet={paymentModal.isPet}
            petName={paymentModal.petName}
          />

          {/* Модальное окно корзины */}
          <CartModal
            isOpen={cartModal}
            onClose={() => setCartModal(false)}
            onCheckout={handleCartCheckout}
          />
        </div>
      </CartProvider>
    </AuthGuard>
  );
};

export default Index;
