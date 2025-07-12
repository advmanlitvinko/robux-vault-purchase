import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, Clock, HeadphonesIcon } from "lucide-react";

export function SupportSection() {
  const handleTelegramClick = () => {
    window.open('https://t.me/robux_support_bot', '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@robuxstore.ru';
  };

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mb-4">
            🛟 Поддержка
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Нужна помощь?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Наша команда поддержки работает 24/7 и готова помочь вам с любыми вопросами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Telegram поддержка */}
          <Card className="hover:shadow-lg transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                Telegram чат
              </CardTitle>
              <CardDescription>
                Самый быстрый способ получить помощь
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Ответ в течение 5 минут</span>
              </div>
              <Button 
                variant="default" 
                className="w-full"
                onClick={handleTelegramClick}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Написать в Telegram
              </Button>
            </CardContent>
          </Card>

          {/* Email поддержка */}
          <Card className="hover:shadow-lg transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                Email поддержка
              </CardTitle>
              <CardDescription>
                Для сложных вопросов и документов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Ответ в течение 2 часов</span>
              </div>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleEmailClick}
              >
                <Mail className="w-4 h-4 mr-2" />
                Написать на почту
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ секция */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-center justify-center">
              <HeadphonesIcon className="w-6 h-6 text-primary" />
              Часто задаваемые вопросы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Как долго идёт зачисление?</h4>
                  <p className="text-sm text-muted-foreground">
                    Обычно Robux поступают в течение 30 минут после оплаты.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Безопасно ли это?</h4>
                  <p className="text-sm text-muted-foreground">
                    Да, мы не просим пароль от аккаунта и работаем через официальные методы.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Можно ли отменить заказ?</h4>
                  <p className="text-sm text-muted-foreground">
                    До зачисления Robux заказ можно отменить с полным возвратом средств.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Какие способы оплаты доступны?</h4>
                  <p className="text-sm text-muted-foreground">
                    Банковские карты, СБП, ЮMoney, QIWI и другие популярные способы.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}