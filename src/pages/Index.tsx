import { useState, useRef } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Header } from '@/components/navigation/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { RobuxCalculator } from '@/components/robux/RobuxCalculator';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { PetsSection } from '@/components/pets/PetsSection';
import { ClassesSection } from '@/components/classes/ClassesSection';
import { InstructionsSection } from '@/components/sections/InstructionsSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { SupportSection } from '@/components/sections/SupportSection';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { useCart } from '@/contexts/CartContext';
import { ReceiptModal } from '@/components/payment/ReceiptModal';
import { QuickBuyToast } from '@/components/ui/quick-buy-toast';

const Index = () => {
  const { clearCart, items, quickBuyItem, getTotalPrice } = useCart();
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    amount: number;
    price: number;
    isPet?: boolean;
    petName?: string;
    isClass?: boolean;
    className?: string;
    classDisplayName?: string;
  }>({
    isOpen: false,
    amount: 0,
    price: 0,
    isPet: false,
    petName: '',
    isClass: false,
    className: '',
    classDisplayName: '',
  });

  const [checkoutModal, setCheckoutModal] = useState({
    isOpen: false,
    items: [] as any[]
  });

  const [receiptModal, setReceiptModal] = useState({
    isOpen: false,
    orderData: null as any
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

  const handleBuyClass = (className: string, price: number) => {
    // Найти данные класса по имени
    const classesData = [
      { name: "Cyborg", displayName: "🧬 Киборг" },
      { name: "Pyromaniac", displayName: "🔥 Пироман" },
      { name: "Big Game Hunter", displayName: "🐺 Грандиозный охотник" },
      { name: "Assassin", displayName: "🗡️ Убийца" },
      { name: "Poison Master", displayName: "☠️ Мастер яда" },
      { name: "Alien", displayName: "👽 Инопланетянин" }
    ];
    
    const classData = classesData.find(c => c.name === className);
    
    setPaymentModal({
      isOpen: true,
      amount: 0,
      price,
      isPet: false,
      petName: '',
      isClass: true,
      className,
      classDisplayName: classData?.displayName || className
    });
  };

  const handleQuickBuy = (pet: any) => {
    setCheckoutModal({
      isOpen: true,
      items: [{
        id: pet.id,
        name: pet.name,
        displayName: pet.displayName,
        price: pet.price,
        image: pet.image,
        quantity: 1,
        type: 'pet'
      }]
    });
  };

  const handleQuickBuyFromToast = () => {
    if (quickBuyItem) {
      setPaymentModal({
        isOpen: true,
        amount: quickBuyItem.amount || 0,
        price: quickBuyItem.price,
        isPet: quickBuyItem.type === 'pet',
        petName: quickBuyItem.type === 'pet' ? quickBuyItem.name : ''
      });
    }
  };

  const handleCartCheckout = (items: any[]) => {
    setCheckoutModal({
      isOpen: true,
      items
    });
  };

  const handleCheckoutSuccess = (orderData: any) => {
    clearCart();
    setCheckoutModal({ isOpen: false, items: [] });
    setReceiptModal({
      isOpen: true,
      orderData
    });
  };

  const handleClosePayment = () => {
    setPaymentModal({
      isOpen: false,
      amount: 0,
      price: 0,
      isPet: false,
      petName: '',
      isClass: false,
      className: '',
      classDisplayName: ''
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Шапка с навигацией */}
        <Header onCartCheckout={handleCartCheckout} />
        
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

        {/* Классы из 99 Nights in the Forest */}
        <ClassesSection onBuyClass={handleBuyClass} />

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
          isClass={paymentModal.isClass}
          className={paymentModal.className}
          classDisplayName={paymentModal.classDisplayName}
          cartItems={items.length > 0 ? items : undefined}
        />
      
      <QuickBuyToast onBuyNow={handleQuickBuyFromToast} />

        {/* Модальное окно оформления заказа */}
        <CheckoutModal
          isOpen={checkoutModal.isOpen}
          onClose={() => setCheckoutModal({ isOpen: false, items: [] })}
          items={checkoutModal.items}
          onSuccess={handleCheckoutSuccess}
        />

        {/* Модальное окно чека */}
        <ReceiptModal
          isOpen={receiptModal.isOpen}
          onClose={() => setReceiptModal({ isOpen: false, orderData: null })}
          orderData={receiptModal.orderData}
        />
      </div>
    </AuthGuard>
  );
};

export default Index;
