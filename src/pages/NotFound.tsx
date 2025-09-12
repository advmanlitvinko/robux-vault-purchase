import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Логирование 404 ошибок для аналитики (без console.error в продакшене)
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-primary mb-4">404</CardTitle>
          <h2 className="text-2xl font-semibold mb-2">Страница не найдена</h2>
          <p className="text-muted-foreground">
            К сожалению, запрашиваемая страница не существует
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/">
              Вернуться на главную
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
