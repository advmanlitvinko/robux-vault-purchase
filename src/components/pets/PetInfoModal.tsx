import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Heart, Star } from "lucide-react";

interface PetInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: {
    name: string;
    displayName: string;
    price: number;
    image: string;
    rarity: string;
    description: string;
    abilities: string[];
    stats: {
      strength: number;
      speed: number;
      intelligence: number;
    };
  } | null;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Легендарный":
      return "bg-gradient-to-r from-yellow-400 to-orange-500";
    case "Эпический":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "Редкий":
      return "bg-gradient-to-r from-blue-500 to-cyan-500";
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-600";
  }
};

const getStatIcon = (stat: string) => {
  switch (stat) {
    case 'strength':
      return Shield;
    case 'speed':
      return Zap;
    case 'intelligence':
      return Star;
    default:
      return Heart;
  }
};

export function PetInfoModal({ isOpen, onClose, pet }: PetInfoModalProps) {
  if (!pet) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            {pet.displayName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Изображение и базовая информация */}
          <div className="text-center space-y-4">
            <div className="relative w-48 h-48 mx-auto">
              <img 
                src={pet.image} 
                alt={pet.displayName}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <Badge className={`absolute -top-2 -right-2 ${getRarityColor(pet.rarity)} text-white border-0`}>
                {pet.rarity}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{pet.displayName}</h3>
              <p className="text-muted-foreground">{pet.description}</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(pet.price)}</p>
            </div>
          </div>

          {/* Способности */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Способности
              </h4>
              <div className="space-y-2">
                {pet.abilities.map((ability, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">{ability}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Характеристики */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Характеристики
              </h4>
              <div className="space-y-3">
                {Object.entries(pet.stats).map(([stat, value]) => {
                  const Icon = getStatIcon(stat);
                  const statNames = {
                    strength: 'Сила',
                    speed: 'Скорость',
                    intelligence: 'Интеллект'
                  };
                  
                  return (
                    <div key={stat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {statNames[stat as keyof typeof statNames]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(value / 100) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Кнопка закрытия */}
          <Button onClick={onClose} className="w-full">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}