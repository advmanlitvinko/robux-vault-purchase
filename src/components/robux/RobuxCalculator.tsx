import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Star, Crown, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface RobuxCalculatorProps {
  onBuy: (amount: number, price: number) => void;
}

const ROBUX_RATE = 0.769; // 1 Robux = 0.769 ₽

const POPULAR_PACKAGES = [
  { amount: 400, price: 300, icon: Coins, popular: false },
  { amount: 1200, price: 900, icon: Zap, popular: true },
  { amount: 3000, price: 2300, icon: Star, popular: false },
  { amount: 6000, price: 4600, icon: Crown, popular: true },
  { amount: 9000, price: 6900, icon: Crown, popular: false },
  { amount: 20000, price: 15300, icon: Crown, popular: true },
];

export function RobuxCalculator({ onBuy }: RobuxCalculatorProps) {
  const [customAmount, setCustomAmount] = useState([1000]);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(true);
  const [hoveredPackage, setHoveredPackage] = useState<number | null>(null);
  const { dispatch } = useCart();

  const currentAmount = isCustomMode ? customAmount[0] : selectedPackage || 0;
  const currentPrice = isCustomMode 
    ? Math.round(customAmount[0] * ROBUX_RATE * 100) / 100
    : POPULAR_PACKAGES.find(p => p.amount === selectedPackage)?.price || 0;

  const handlePackageSelect = (packageAmount: number) => {
    setSelectedPackage(packageAmount);
    setIsCustomMode(false);
  };

  const handleSliderChange = (value: number[]) => {
    setCustomAmount(value);
    setSelectedPackage(null);
    setIsCustomMode(true);
  };

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

  const addToCart = (amount: number, price: number) => {
    const id = `robux-${amount}`;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id,
        name: `${formatAmount(amount)} Robux`,
        price,
        type: 'robux',
        amount
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Настраиваемое количество */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Slider className="w-5 h-5" />
            Настроить количество
          </CardTitle>
          <CardDescription>
            Выберите точное количество Robux от 100 до 20000
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Slider
              value={customAmount}
              onValueChange={handleSliderChange}
              max={20000}
              min={100}
              step={10}
              className="w-full"
              disabled={!isCustomMode}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>100</span>
              <span>20000</span>
            </div>
          </div>
          
          {isCustomMode && (
            <div className="text-center space-y-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  Вы выбрали: <span className="text-primary">{formatAmount(customAmount[0])} Robux</span>
                </p>
                <p className="text-2xl font-bold text-foreground">
                  Цена: {formatPrice(currentPrice)}
                </p>
              </div>
              <Button 
                variant="robux" 
                size="lg"
                onClick={() => onBuy(customAmount[0], currentPrice)}
                className="w-full"
              >
                <Coins className="w-5 h-5 mr-2" />
                Купить {formatAmount(customAmount[0])} Robux за {formatPrice(currentPrice)}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Популярные пакеты */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Популярные пакеты
          </CardTitle>
          <CardDescription>
            Готовые варианты с лучшими ценами
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              const isSelected = selectedPackage === pkg.amount;
              
              return (
                <Card 
                  key={pkg.amount}
                  className={`group cursor-pointer transition-all duration-200 hover:shadow-lg relative ${
                    isSelected 
                      ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
                      : 'hover:ring-1 hover:ring-primary/50'
                  }`}
                  onMouseEnter={() => setHoveredPackage(pkg.amount)}
                  onMouseLeave={() => setHoveredPackage(null)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                      Популярный
                    </Badge>
                  )}
                  
                  <CardContent className="p-4 text-center space-y-3">
                    <Icon className={`w-8 h-8 mx-auto ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="space-y-1">
                      <p className="font-bold text-lg">{formatAmount(pkg.amount)} Robux</p>
                      <p className="text-xl font-semibold text-primary">{formatPrice(pkg.price)}</p>
                      <p className="text-xs text-muted-foreground">
                        ~{(pkg.price / pkg.amount).toFixed(3)} ₽ за Robux
                      </p>
                    </div>
                    
                    {/* Меню количества, появляется при hover */}
                    <div className={`transition-all duration-200 ${
                      hoveredPackage === pkg.amount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(pkg.amount, pkg.price);
                          }}
                          className="px-2"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium">Добавить в корзину</span>
                      </div>
                      <Button 
                        variant="robux" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuy(pkg.amount, pkg.price);
                        }}
                        className="w-full text-sm"
                      >
                        <Coins className="w-4 h-4 mr-1" />
                        Купить сейчас
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}