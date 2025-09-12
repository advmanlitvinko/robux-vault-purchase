import { useState } from "react";
import { ClassCard } from "./ClassCard";
import { ClassInfoModal } from "./ClassInfoModal";
import { Cpu, Flame, Target, Sword, Skull, Zap } from "lucide-react";

// Импорт изображений классов
import cyborgImage from "@/assets/classes/cyborg.jpeg";
import pyromaniacImage from "@/assets/classes/pyromaniac.gif";
import bigGameHunterImage from "@/assets/classes/big-game-hunter.gif";
import assassinImage from "@/assets/classes/assassin.gif";
import poisonMasterImage from "@/assets/classes/poison-master.gif";
import alienImage from "@/assets/classes/alien.gif";

interface ClassesSectionProps {
  onBuyClass: (className: string, price: number) => void;
}

const CLASSES_DATA = [
  {
    id: "class-cyborg",
    name: "Cyborg",
    displayName: "🧬 Киборг",
    price: 600,
    currency: "алмазов",
    image: cyborgImage,
    icon: Cpu,
    rarity: "Epic",
    description: "Высокотехнологичный киборг с инопланетными технологиями",
    startingItems: "Инопланетная броня (Alien Armor), Лазерная пушка (Laser Cannon)",
    abilities: [
      "Уровень 1: Если инопланетная технология перегревается, вы получаете урон, и ваша броня временно снижается.",
      "Уровень 2: Вы получаете лечебный бонус, когда инопланетная технология полностью заряжена.",
      "Уровень 3: Убийства восстанавливают некоторое количество энергии инопланетной технологии."
    ]
  },
  {
    id: "class-pyromaniac",
    name: "Pyromaniac",
    displayName: "🔥 Пироман",
    price: 600,
    currency: "алмазов",
    image: pyromaniacImage,
    icon: Flame,
    rarity: "Epic",
    description: "Специалист по огневой мощи с мощным огнемётом",
    startingItems: "Огнемёт (Flamethrower)",
    abilities: [
      "Уровень 1: Перезарядка огнемёта осуществляется с помощью топливных канистр.",
      "Уровень 2: Топливные канистры восстанавливают ещё больше топлива.",
      "Уровень 3: Вы двигаетесь быстрее за каждого горящего врага."
    ]
  },
  {
    id: "class-big-game-hunter",
    name: "Big Game Hunter",
    displayName: "🐺 Грандиозный охотник",
    price: 600,
    currency: "алмазов",
    image: bigGameHunterImage,
    icon: Target,
    rarity: "Epic",
    description: "Опытный охотник на крупную дичь с мощной винтовкой",
    startingItems: "Винтовка (Rifle), Боеприпасы (Rifle Ammo)",
    abilities: [
      "Уровень 1: Можно потреблять шкуру животных, чтобы получать постоянные бонусы.",
      "Уровень 2: Увеличенная вероятность выпадения шкур.",
      "Уровень 3: Можно бесконечно потреблять бивни мамонта, чтобы постоянно увеличивать здоровье."
    ]
  },
  {
    id: "class-assassin",
    name: "Assassin",
    displayName: "🗡️ Убийца",
    price: 500,
    currency: "алмазов",
    image: assassinImage,
    icon: Sword,
    rarity: "Rare",
    description: "Быстрый и смертоносный убийца с катаной",
    startingItems: "Катана (Katana), 120 Бросковых ножей (Throwing Knives)",
    abilities: [
      "Уровень 1: +10% к скорости бега, -15% к максимальному здоровью.",
      "Уровень 2: Первая атака по врагу имеет шанс на критический удар.",
      "Уровень 3: Шанс появления сюрикенов в сундуках увеличивается до 10%."
    ]
  },
  {
    id: "class-poison-master",
    name: "Poison Master",
    displayName: "☠️ Мастер яда",
    price: 200,
    currency: "алмазов",
    image: poisonMasterImage,
    icon: Skull,
    rarity: "Common",
    description: "Специалист по ядовитым веществам и отравляющим атакам",
    startingItems: "Ядовитая броня (Poison Armor), Дудка (Blowpipe)",
    abilities: [
      "Уровень 1: Ядовитая броня наносит урон врагам при контакте.",
      "Уровень 2: Увеличение урона от атак по врагам, имеющим ядовитый эффект.",
      "Уровень 3: Дополнительный урон по врагам с ядовитым статусом."
    ]
  },
  {
    id: "class-alien",
    name: "Alien",
    displayName: "👽 Инопланетянин",
    price: 100,
    currency: "алмазов",
    image: alienImage,
    icon: Zap,
    rarity: "Common",
    description: "Загадочный инопланетянин с продвинутыми технологиями",
    startingItems: "Рейган (Raygun)",
    abilities: [
      "Уровень 1: Отличная видимость ночью, замедление спринта при перегреве инопланетной технологии, ускоренная перезарядка при полной зарядке инопланетной технологии.",
      "Уровень 2: Быстрое восстановление энергии инопланетной технологии.",
      "Уровень 3: Увеличение скорости бега при полной зарядке инопланетной технологии."
    ]
  }
];

export const ClassesSection = ({ onBuyClass }: ClassesSectionProps) => {
  const [selectedClass, setSelectedClass] = useState<typeof CLASSES_DATA[0] | null>(null);

  const openClassInfo = (classData: typeof CLASSES_DATA[0]) => {
    setSelectedClass(classData);
  };

  const closeClassInfo = () => {
    setSelectedClass(null);
  };

  const firstRow = CLASSES_DATA.slice(0, 3);
  const secondRow = CLASSES_DATA.slice(3, 6);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Классы из 99 Nights in the Forest
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Коллекция уникальных классов из популярной игры Roblox
          </p>
        </div>

        <div className="space-y-8">
          {/* Первый ряд */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firstRow.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onShowInfo={openClassInfo}
              />
            ))}
          </div>

          {/* Второй ряд */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondRow.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onShowInfo={openClassInfo}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно с информацией о классе */}
      {selectedClass && (
        <ClassInfoModal
          classData={selectedClass}
          isOpen={!!selectedClass}
          onClose={closeClassInfo}
          onBuy={onBuyClass}
        />
      )}
    </section>
  );
};