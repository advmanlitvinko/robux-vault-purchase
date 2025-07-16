import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Heart, Star } from "lucide-react";

interface PetInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: {
    id: string;
    name: string;
    displayName: string;
    price: number;
    image: string;
    rarity: string;
    description: string;
    ability: string;
    obtainMethod: string;
    obtainChance: string;
  } | null;
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

          {/* Способность */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Способность
              </h4>
              <p className="text-sm text-muted-foreground">{pet.ability}</p>
            </CardContent>
          </Card>

          {/* Метод получения */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Метод получения
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Источник:</span>
                  <span className="text-sm font-medium">{pet.obtainMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Шанс:</span>
                  <span className="text-sm font-medium">{pet.obtainChance}</span>
                </div>
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