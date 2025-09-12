import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuantityControl } from "@/components/ui/quantity-control";
import { useCart } from "@/contexts/CartContext";
import { Info } from "lucide-react";

interface ClassCardProps {
  classData: {
    id: string;
    name: string;
    displayName: string;
    price: number;
    currency: string;
    image: string;
    icon: React.ComponentType<any>;
    rarity: string;
    description: string;
    startingItems: string;
    abilities: string[];
  };
  onShowInfo: (classData: any) => void;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Epic":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "Rare":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "Common":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

export const ClassCard = ({ classData, onShowInfo }: ClassCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  const cartItem = items.find(item => item.id === classData.id);
  const isInCart = !!cartItem;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const handleBuyClick = () => {
    addItem({
      id: classData.id,
      name: classData.name,
      displayName: classData.displayName,
      price: classData.price,
      image: classData.image,
      type: 'class'
    });
    
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleQuantityChange = (change: number) => {
    if (cartItem) {
      const newQuantity = Math.max(0, cartItem.quantity + change);
      updateQuantity(classData.id, newQuantity);
    }
  };

  const IconComponent = classData.icon;

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardContent className="p-0">
        {/* Изображение класса */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={classData.image}
            alt={classData.displayName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Бейдж редкости */}
          <Badge className={`absolute top-3 left-3 ${getRarityColor(classData.rarity)}`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {classData.rarity}
          </Badge>

          {/* Кнопка информации */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            onClick={() => onShowInfo(classData)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>

        {/* Информация о классе */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{classData.displayName}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {classData.description}
            </p>
          </div>

          {/* Цена */}
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(classData.price)} {classData.currency}
            </div>
          </div>

          {/* Кнопка покупки или контрол количества */}
          <div className="space-y-2">
            {!isInCart ? (
              <Button 
                onClick={handleBuyClick}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                size="lg"
              >
                Купить класс
              </Button>
            ) : (
              <QuantityControl
                quantity={cartItem.quantity}
                onDecrease={() => handleQuantityChange(-1)}
                onIncrease={() => handleQuantityChange(1)}
                onAdd={handleBuyClick}
                isInCart={isInCart}
              />
            )}

            {/* Сообщение о добавлении */}
            {showAdded && (
              <div className="text-center text-sm text-green-400 font-medium animate-in fade-in-0 duration-500">
                ✓ Добавлено в корзину
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};