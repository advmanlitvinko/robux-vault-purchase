import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Clock, Star, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
      
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          {/* Бейдж с акцией */}
          <Badge variant="secondary" className="text-sm px-4 py-2 animate-bounce-slow">
            🔥 Лучшие цены на Robux
          </Badge>
          
          {/* Главный заголовок */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Купи Robux быстро и удобно
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Выбирай пакет или настрой сам — оформи в пару кликов
            </p>
          </div>

          {/* Статистика */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Уже пополнено: <strong>800,000 Robux</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-warning" />
              <span>Рейтинг: <strong>4.9/5</strong></span>
            </div>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-3">
                <Zap className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-semibold">Мгновенно</h3>
                <p className="text-sm text-muted-foreground">
                  Robux зачисляются в течение 30 минут
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-secondary/10 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-3">
                <Shield className="w-8 h-8 text-secondary mx-auto" />
                <h3 className="font-semibold">Безопасно</h3>
                <p className="text-sm text-muted-foreground">
                  Не просим пароль от аккаунта
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-accent/10 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-3">
                <Clock className="w-8 h-8 text-accent mx-auto" />
                <h3 className="font-semibold">24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Круглосуточная поддержка
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA кнопка */}
          <Button
            variant="premium"
            size="lg"
            onClick={onGetStarted}
            className="text-xl px-12 py-6 animate-glow"
          >
            <Zap className="w-6 h-6 mr-2" />
            Начать покупку
          </Button>
        </div>
      </div>
    </section>
  );
}