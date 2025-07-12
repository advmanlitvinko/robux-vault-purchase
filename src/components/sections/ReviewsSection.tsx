import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: "DarkGamer2010",
      avatar: "DG",
      rating: 5,
      comment: "Очень быстро получил Robux! Всего 15 минут и всё готово. Рекомендую!",
      robux: 3000,
      verified: true
    },
    {
      id: 2,
      name: "MinecraftLover",
      avatar: "ML",
      rating: 5,
      comment: "Покупаю здесь уже третий раз. Всегда всё работает отлично, никаких проблем.",
      robux: 1200,
      verified: true
    },
    {
      id: 3,
      name: "ProBuilder99",
      avatar: "PB",
      rating: 5,
      comment: "Самый надёжный сайт для покупки Robux! Поддержка очень быстро отвечает.",
      robux: 6000,
      verified: false
    },
    {
      id: 4,
      name: "CoolGirl2008",
      avatar: "CG",
      rating: 5,
      comment: "Мама разрешила покупать здесь, потому что это безопасно. Спасибо!",
      robux: 400,
      verified: true
    },
    {
      id: 5,
      name: "RobloxMaster",
      avatar: "RM",
      rating: 4,
      comment: "Хорошие цены и быстрая доставка. Иногда приходится ждать дольше 30 минут.",
      robux: 9000,
      verified: true
    },
    {
      id: 6,
      name: "GamePlayer123",
      avatar: "GP",
      rating: 5,
      comment: "Покупал 20k Robux, всё пришло как обещали. Очень доволен сервисом!",
      robux: 20000,
      verified: true
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'fill-warning text-warning' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const formatRobux = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mb-4">
            ✅ Отзывы клиентов
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Что говорят наши клиенты
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Более 10,000 довольных клиентов уже получили свои Robux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                {/* Хедер отзыва */}
                <div className="flex items-center gap-3">
                  <Avatar className="group-hover:scale-110 transition-transform duration-300">
                    <AvatarImage src={`/placeholder-avatar-${review.id}.jpg`} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-bold">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{review.name}</p>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs px-2">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>

                {/* Текст отзыва */}
                <blockquote className="text-sm text-muted-foreground italic">
                  "{review.comment}"
                </blockquote>

                {/* Информация о покупке */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Купил: {formatRobux(review.robux)} Robux
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Проверенная покупка
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Общая статистика */}
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {renderStars(5)}
                <span className="font-bold text-lg ml-2">4.9/5</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Средняя оценка по 2,847 отзывам
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}