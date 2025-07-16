import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Star, Crown } from "lucide-react";

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

  return (
    <div className="space-y-8">
      {/* Настраиваемое количество */}
        <Card className="shadow-xl bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20">
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
            <div className="text-center space-y-4 p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-xl border border-primary/20 shadow-lg">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  Вы выбрали: <span className="text-primary font-bold">{formatAmount(customAmount[0])} Robux</span>
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Цена: {formatPrice(currentPrice)}
                </p>
              </div>
              
              <Button 
                variant="default"
                size="lg"
                onClick={() => onBuy(customAmount[0], currentPrice)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Coins className="w-5 h-5 mr-2" />
                Купить {formatAmount(customAmount[0])} Robux за {formatPrice(currentPrice)}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Популярные пакеты */}
      <Card className="shadow-xl bg-gradient-to-br from-card via-card to-secondary/5 border-2 border-secondary/20">
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
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-card to-primary/5 border-2 hover:border-primary/60 ${
                    isSelected 
                      ? 'ring-2 ring-primary shadow-xl bg-primary/10 border-primary' 
                      : 'hover:ring-1 hover:ring-primary/50'
                  }`}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-primary text-white font-semibold shadow-lg">
                      Популярный
                    </Badge>
                  )}
                  
                  <CardContent className="p-4 text-center space-y-3 bg-gradient-to-b from-transparent to-primary/5 rounded-lg">
                    <Icon className={`w-10 h-10 mx-auto transition-all duration-300 ${isSelected ? 'text-primary scale-110' : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'}`} />
                    <div className="space-y-1">
                      <p className="font-bold text-xl text-foreground">{formatAmount(pkg.amount)} Robux</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {formatPrice(pkg.price)}
                      </p>
                      <p className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                        ~{(pkg.price / pkg.amount).toFixed(3)} ₽ за Robux
                      </p>
                    </div>
                    
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuy(pkg.amount, pkg.price);
                      }}
                      className="w-full text-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Coins className="w-4 h-4 mr-1" />
                      Купить сейчас
                    </Button>
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