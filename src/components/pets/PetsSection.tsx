import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Star, Crown, Sparkles, Bug } from "lucide-react";

// Импорт изображений питомцев
import RaccoonImage from "@/assets/pets/raccoon.png";
import TRexImage from "@/assets/pets/t-rex.png";
import DiscoBeeImage from "@/assets/pets/disco-bee.png";
import QueenBeeImage from "@/assets/pets/queen-bee.png";
import MimicOctopusImage from "@/assets/pets/mimic-octopus.png";
import DragonflyImage from "@/assets/pets/dragonfly.png";

interface PetsSectionProps {
  onBuyPet: (petName: string, price: number) => void;
}

const PETS_DATA = [
  {
    name: "Raccoon",
    displayName: "Енот",
    price: 549,
    image: RaccoonImage,
    icon: Heart,
    rarity: "Редкий",
    description: "Хитрый енот-воришка"
  },
  {
    name: "T-Rex",
    displayName: "Т-Рекс",
    price: 899,
    image: TRexImage,
    icon: Star,
    rarity: "Легендарный",
    description: "Могучий тираннозавр"
  },
  {
    name: "Disco Bee",
    displayName: "Диско Пчела",
    price: 999,
    image: DiscoBeeImage,
    icon: Sparkles,
    rarity: "Легендарный",
    description: "Танцующая дискотечная пчела"
  },
  {
    name: "Queen Bee",
    displayName: "Королева Пчел",
    price: 299,
    image: QueenBeeImage,
    icon: Crown,
    rarity: "Эпический",
    description: "Величественная королева улья"
  },
  {
    name: "Mimic Octopus",
    displayName: "Осьминог",
    price: 299,
    image: MimicOctopusImage,
    icon: Zap,
    rarity: "Эпический",
    description: "Мимический осьминог-перевертыш"
  },
  {
    name: "Dragonfly",
    displayName: "Стрекоза",
    price: 299,
    image: DragonflyImage,
    icon: Bug,
    rarity: "Обычный",
    description: "Быстрая стрекоза"
  }
];

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

export function PetsSection({ onBuyPet }: PetsSectionProps) {
  const [hoveredPet, setHoveredPet] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const firstRow = PETS_DATA.slice(0, 3);
  const secondRow = PETS_DATA.slice(3, 6);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Питомцы из Grow a Garden
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Коллекция уникальных питомцев из популярной игры Roblox
          </p>
        </div>

        <div className="space-y-6">
          {/* Первый ряд */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firstRow.map((pet) => {
              const Icon = pet.icon;
              const isHovered = hoveredPet === pet.name;
              
              return (
                <Card 
                  key={pet.name}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50"
                  onMouseEnter={() => setHoveredPet(pet.name)}
                  onMouseLeave={() => setHoveredPet(null)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pet.displayName}</CardTitle>
                      <Badge className={`${getRarityColor(pet.rarity)} text-white border-0`}>
                        {pet.rarity}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {pet.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Изображение питомца */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                      <img 
                        src={pet.image} 
                        alt={pet.displayName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
                    
                    {/* Кнопка покупки */}
                    <div className={`transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      <Button 
                        variant="premium" 
                        size="lg"
                        onClick={() => onBuyPet(pet.displayName, pet.price)}
                        className="w-full"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Купить {pet.displayName}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Второй ряд */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondRow.map((pet) => {
              const Icon = pet.icon;
              const isHovered = hoveredPet === pet.name;
              
              return (
                <Card 
                  key={pet.name}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50"
                  onMouseEnter={() => setHoveredPet(pet.name)}
                  onMouseLeave={() => setHoveredPet(null)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pet.displayName}</CardTitle>
                      <Badge className={`${getRarityColor(pet.rarity)} text-white border-0`}>
                        {pet.rarity}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {pet.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Изображение питомца */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                      <img 
                        src={pet.image} 
                        alt={pet.displayName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
                    
                    {/* Кнопка покупки */}
                    <div className={`transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      <Button 
                        variant="premium" 
                        size="lg"
                        onClick={() => onBuyPet(pet.displayName, pet.price)}
                        className="w-full"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Купить {pet.displayName}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}