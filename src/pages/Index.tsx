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
import { CartProvider, useCart } from '@/hooks/useCart';
import { CartModal } from '@/components/cart/CartModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

const CartButton = ({ onCheckout }: { onCheckout: (total: number) => void }) => {
  const { state } = useCart();
  const [cartModal, setCartModal] = useState(false);
  
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setCartModal(true)}
          className="relative rounded-full w-14 h-14 shadow-lg"
          size="lg"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 px-2 py-1 text-xs min-w-[20px] h-6 flex items-center justify-center"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>
      
      <CartModal
        isOpen={cartModal}
        onClose={() => setCartModal(false)}
        onCheckout={(total) => {
          setCartModal(false);
          onCheckout(total);
        }}
      />
    </>
  );
};

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

  return (
    <AuthGuard>
      <CartProvider>
        <div className="min-h-screen bg-background">
          {/* Шапка с навигацией */}
          <Header />
          
          {/* Кнопка корзины */}
          <CartButton onCheckout={handleCartCheckout} />
        
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
            <RobuxCalculator onBuy={handleBuy} />
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

        </div>
      </CartProvider>
    </AuthGuard>
  );
};

export default Index;
