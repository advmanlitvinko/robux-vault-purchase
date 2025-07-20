import { useState } from 'react';
import { PetInfoModal } from './PetInfoModal';
import { PetCard } from '@/components/cart/PetCard';
import { Zap, Star, Crown, Sparkles } from "lucide-react";

// Прямые ссылки на изображения питомцев с Imgur
const RaccoonImage = "https://i.imgur.com/JqSXdnW.png";
const TRexImage = "https://i.imgur.com/62X40H6.png";
const DiscoBeeImage = "https://i.imgur.com/izvUMJx.png";
const KitsuneImage = "https://i.imgur.com/3MiXHb6.png";
const MimicOctopusImage = "https://i.imgur.com/FbzxJDD.png";
const DragonflyImage = "https://i.imgur.com/VpukYFb.png";

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
    icon: Zap,
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
    id: "pet-kitsune",
    name: "Kitsune",
    displayName: "Kitsune (Девятихвостая лиса)",
    price: 3999,
    image: KitsuneImage,
    icon: Crown,
    rarity: "Prismatic",
    description: "Легендарная девятихвостая лиса",
    ability: "Миф о Девятихвостом: каждые 22 минуты подходит к фрукту другого игрока, мутирует его с помощью чакры, крадёт (дублирует) и отдаёт игроку! Очень редкий шанс мутировать с помощью чакры Лисьего Огня.",
    obtainMethod: "Яйцо Дзен",
    obtainChance: "0,08%"
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
    icon: Sparkles,
    rarity: "Divine",
    description: "Быстрая стрекоза",
    ability: "Трансмутация: каждые ~5 минут одно случайное растение станет золотым.",
    obtainMethod: "Яйца насекомых, Яйцо экзотического насекомого",
    obtainChance: "1%"
  }
];

export function PetsSection({ onBuyPet }: PetsSectionProps) {
  const [selectedPet, setSelectedPet] = useState<typeof PETS_DATA[0] | null>(null);

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
            {firstRow.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onShowInfo={openPetInfo}
              />
            ))}
          </div>

          {/* Второй ряд */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondRow.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onShowInfo={openPetInfo}
              />
            ))}
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