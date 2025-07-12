import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, CreditCard, Gift, ArrowRight, Shield } from "lucide-react";

export function InstructionsSection() {
  const steps = [
    {
      icon: User,
      title: "Выберите количество",
      description: "Настройте нужное количество Robux или выберите готовый пакет",
      color: "text-primary"
    },
    {
      icon: CreditCard,
      title: "Введите никнейм",
      description: "Укажите ваш Roblox-никнейм для зачисления Robux",
      color: "text-secondary"
    },
    {
      icon: Gift,
      title: "Оплатите покупку",
      description: "Выберите удобный способ оплаты и завершите покупку",
      color: "text-accent"
    },
    {
      icon: CheckCircle,
      title: "Получите Robux",
      description: "Robux поступят на ваш аккаунт в течение 30 минут",
      color: "text-success"
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mb-4">
            📱 Инструкция
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Как получить Robux
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Простой процесс покупки в 4 шага
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardContent>

                {/* Стрелка между шагами */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-background border rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Безопасность</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>🔒 Мы не просим пароль от вашего аккаунта</p>
                <p>💯 Все покупки проходят через официальную Roblox-группу</p>
                <p>💸 Гарантия возврата средств</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}