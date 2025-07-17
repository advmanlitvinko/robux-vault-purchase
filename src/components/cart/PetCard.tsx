import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Sparkles, Info, Check } from "lucide-react";
import { useCart } from '@/contexts/CartContext';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    displayName: string;
    price: number;
    image: string;
    icon: any;
    rarity: string;
    description: string;
  };
  onShowInfo: (pet: any) => void;
  onQuickBuy: (pet: any) => void;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Divine":
      return "bg-gradient-to-r from-yellow-400 to-orange-500";
    case "Мифический":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "Эпический":
      return "bg-gradient-to-r from-blue-500 to-cyan-500";
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-600";
  }
};

export function PetCard({ pet, onShowInfo, onQuickBuy }: PetCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showQuickBuyNotification, setShowQuickBuyNotification] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const cartItem = items.find(item => item.id === pet.id);
  const Icon = pet.icon;

  const handleBuyClick = () => {
    addItem({
      id: pet.id,
      name: pet.name,
      displayName: pet.displayName,
      price: pet.price,
      image: pet.image,
      type: 'pet'
    });

    // Показать сообщение о добавлении
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);

    // Показать уведомление о быстрой покупке
    setShowQuickBuyNotification(true);
    setTimeout(() => setShowQuickBuyNotification(false), 10000);
  };

  const handleQuantityChange = (change: number) => {
    if (cartItem) {
      updateQuantity(pet.id, cartItem.quantity + change);
    }
  };

  return (
    <>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{pet.displayName}</CardTitle>
            <Badge className={`${getRarityColor(pet.rarity)} text-white border-0`}>
              {pet.rarity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {pet.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Изображение питомца */}
          <div 
            className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer"
            onClick={() => onShowInfo(pet)}
          >
            <img 
              src={pet.image} 
              alt={pet.displayName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
              <div className="bg-white/90 rounded-full p-2">
                <Info className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            {/* Сообщение о добавлении */}
            {showAddedMessage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 animate-fade-in">
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Товар добавлен в корзину</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Информация о цене */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Цена:</span>
            </div>
            <span className="text-xl font-bold text-primary">
              {formatPrice(pet.price)}
            </span>
          </div>
          
          {/* Кнопка покупки или счетчик */}
          {!cartItem ? (
            <Button 
              onClick={handleBuyClick}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Купить
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-3 p-2 border rounded-lg">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Уведомление о быстрой покупке */}
      {showQuickBuyNotification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-right">
          <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center gap-3">
              <img 
                src={pet.image} 
                alt={pet.displayName}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{pet.displayName}</h4>
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={() => {
                    onQuickBuy(pet);
                    setShowQuickBuyNotification(false);
                  }}
                >
                  Купить сейчас
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}