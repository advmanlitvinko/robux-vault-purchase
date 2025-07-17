import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface QuickBuyToastProps {
  onBuyNow: () => void;
}

export function QuickBuyToast({ onBuyNow }: QuickBuyToastProps) {
  const { quickBuyItem, setQuickBuyItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (quickBuyItem) {
      setIsVisible(true);
      // Автоматически скрыть через 10 секунд
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setQuickBuyItem(null), 300); // Дать время на анимацию
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [quickBuyItem, setQuickBuyItem]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setQuickBuyItem(null), 300);
  };

  const handleBuyNow = () => {
    onBuyNow();
    handleClose();
  };

  if (!quickBuyItem) return null;

  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Card className="shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm max-w-sm mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">{quickBuyItem.displayName}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleBuyNow}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            Купить сейчас
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}