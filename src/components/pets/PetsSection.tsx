import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Star, Crown, Sparkles, Bug, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { PetInfoModal } from './PetInfoModal';
import { QuantityControl } from '@/components/ui/quantity-control';

// Импорт изображений питомцев
import RaccoonImage from "@/assets/pets/raccoon.png";
import TRexImage from "@/assets/pets/t-rex.png";
import DiscoBeeImage from "@/assets/pets/disco-bee.gif";
import QueenBeeImage from "@/assets/pets/queen-bee.png";
import MimicOctopusImage from "@/assets/pets/mimic-octopus.webp";
import DragonflyImage from "@/assets/pets/dragonfly.png";

interface PetsSectionProps {
  onBuyPet: (petName: string, price: number) => void;
}

const PETS_DATA = [
  {
    id: "pet-raccoon",
    name: "Raccoon",
    displayName: "Енот",
    price: 549,
    image: RaccoonImage,
    icon: Heart,
    rarity: "Divine",
    description: "Хитрый енот-воришка",
    ability: "Примерно каждые 15 минут идет на участок другого игрока, крадет (дублирует) случайный урожай и отдает его игроку!",
    obtainMethod: "Ночное Яйцо, Экзотическое ночное яйцо",
    obtainChance: "Ночное яйцо 0,1%, Экзотическое ночное яйцо 1%"
  },
  {
    id: "pet-trex",
    name: "T-Rex",
    displayName: "Ти-Рекс",
    price: 899,
    image: TRexImage,
    icon: Star,
    rarity: "Divine",
    description: "Могучий тираннозавр",
    ability: "Сверххищник: время от времени поедает случайную мутацию фруктов в вашем саду, затем рычит и применяет эту мутацию к другим фруктам в вашем саду.",
    obtainMethod: "Яйцо Динозавра",
    obtainChance: "0,5%"
  },
  {
    id: "pet-disco-bee",
    name: "Disco Bee",
    displayName: "Disco Bee",
    price: 999,
    image: DiscoBeeImage,
    icon: Sparkles,
    rarity: "Divine",
    description: "Танцующая дискотечная пчела",
    ability: "Каждые ~15 м есть ~16% вероятность, что близлежащий фрукт станет Диско.",
    obtainMethod: "Анти-пчелиное яйцо, Премиум Анти-Пчелиные Яйца",
    obtainChance: "0,25%"
  },
  {
    id: "pet-queen-bee",
    name: "Queen Bee",
    displayName: "Королева пчел",
    price: 299,
    image: QueenBeeImage,
    icon: Crown,
    rarity: "Divine",
    description: "Величественная королева улья",
    ability: "Примерно каждые 20 минут близлежащий фрукт магическим образом опыляется, применяя мутацию «Опыленный». Примерно каждые 23 минуты питомец с самым большим временем перезарядки обновляет свою способность! Способности мутаций питомца не обновляются.",
    obtainMethod: "Пчелиное яйцо",
    obtainChance: "1%"
  },
  {
    id: "pet-octopus",
    name: "Mimic Octopus",
    displayName: "Подражательный осьминог",
    price: 299,
    image: MimicOctopusImage,
    icon: Zap,
    rarity: "Мифический",
    description: "Мимический осьминог-перевертыш",
    ability: "Осьминог: каждые 20 минут имитирует и копирует способность другого питомца и выполняет его способность!",
    obtainMethod: "Райское яйцо",
    obtainChance: "1%"
  },
  {
    id: "pet-dragonfly",
    name: "Dragonfly",
    displayName: "Стрекоза",
    price: 299,
    image: DragonflyImage,
    icon: Bug,
    rarity: "Divine",
    description: "Быстрая стрекоза",
    ability: "Трансмутация: каждые ~5 минут одно случайное растение станет золотым.",
    obtainMethod: "Яйца насекомых, Яйцо экзотического насекомого",
    obtainChance: "1%"
  }
];

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

export function PetsSection({ onBuyPet }: PetsSectionProps) {
  const [selectedPet, setSelectedPet] = useState<typeof PETS_DATA[0] | null>(null);
  const { state, dispatch } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const addToCart = (pet: typeof PETS_DATA[0]) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: pet.id,
        name: pet.displayName,
        price: pet.price,
        type: 'pet',
        image: pet.image
      }
    });
  };

  const updateQuantity = (pet: typeof PETS_DATA[0], quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: pet.id, quantity }
    });
  };

  const getCartQuantity = (petId: string) => {
    const item = state.items.find(item => item.id === petId);
    return item ? item.quantity : 0;
  };

  const openPetInfo = (pet: typeof PETS_DATA[0]) => {
    setSelectedPet(pet);
  };

  const closePetInfo = () => {
    setSelectedPet(null);
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
              
              return (
                <Card 
                  key={pet.name}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50"
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
                    <div 
                      className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer"
                      onClick={() => openPetInfo(pet)}
                    >
                      <img 
                        src={pet.image} 
                        alt={pet.displayName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <div className="bg-white/90 rounded-full p-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                      </div>
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
                    
                    {/* Управление количеством */}
                    <div className="space-y-2">
                      <QuantityControl
                        quantity={getCartQuantity(pet.id)}
                        onIncrease={() => updateQuantity(pet, getCartQuantity(pet.id) + 1)}
                        onDecrease={() => updateQuantity(pet, getCartQuantity(pet.id) - 1)}
                        onAdd={() => addToCart(pet)}
                        isInCart={getCartQuantity(pet.id) > 0}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onBuyPet(pet.displayName, pet.price)}
                        className="w-full"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Купить сейчас
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
              
              return (
                <Card 
                  key={pet.name}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50"
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
                    <div 
                      className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer"
                      onClick={() => openPetInfo(pet)}
                    >
                      <img 
                        src={pet.image} 
                        alt={pet.displayName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <div className="bg-white/90 rounded-full p-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                      </div>
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
                    
                    {/* Управление количеством */}
                    <div className="space-y-2">
                      <QuantityControl
                        quantity={getCartQuantity(pet.id)}
                        onIncrease={() => updateQuantity(pet, getCartQuantity(pet.id) + 1)}
                        onDecrease={() => updateQuantity(pet, getCartQuantity(pet.id) - 1)}
                        onAdd={() => addToCart(pet)}
                        isInCart={getCartQuantity(pet.id) > 0}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onBuyPet(pet.displayName, pet.price)}
                        className="w-full"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Купить сейчас
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Модальное окно с информацией о питомце */}
      <PetInfoModal
        isOpen={!!selectedPet}
        onClose={closePetInfo}
        pet={selectedPet}
      />
    </section>
  );
}