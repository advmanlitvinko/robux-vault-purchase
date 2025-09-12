import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ClassInfoModalProps {
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
  isOpen: boolean;
  onClose: () => void;
  onBuy: (className: string, price: number) => void;
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

export const ClassInfoModal = ({ classData, isOpen, onClose, onBuy }: ClassInfoModalProps) => {
  const handleBuy = () => {
    onBuy(classData.name, classData.price);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const IconComponent = classData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{classData.displayName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Изображение и основная информация */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={classData.image}
                  alt={classData.displayName}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <Badge className={`absolute top-2 left-2 ${getRarityColor(classData.rarity)}`}>
                  <IconComponent className="w-3 h-3 mr-1" />
                  {classData.rarity}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-semibold mb-2">Описание</h3>
                <p className="text-muted-foreground">{classData.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Начальные предметы</h3>
                <p className="text-muted-foreground">{classData.startingItems}</p>
              </div>

              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(classData.price)} {classData.currency}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Способности */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Способности класса</h3>
            <div className="space-y-3">
              {classData.abilities.map((ability, index) => (
                <div key={index} className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{ability}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Кнопки действий */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Закрыть
            </Button>
            <Button 
              onClick={handleBuy} 
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              Купить за {formatPrice(classData.price)} {classData.currency}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};