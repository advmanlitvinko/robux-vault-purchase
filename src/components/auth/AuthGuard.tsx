import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const CORRECT_PASSWORD = "Zx7Np2Rt8K";
const MAX_ATTEMPTS = 3;

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Проверяем cookie при загрузке
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('robux_auth_v4='));
    
    if (authCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) return;

    if (password === CORRECT_PASSWORD) {
      // Успешная авторизация
      setIsAuthenticated(true);
      // Сохраняем в cookie на 24 часа
      const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      document.cookie = `robux_auth_v4=true; expires=${expiryDate.toUTCString()}; path=/`;
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setError("Доступ заблокирован");
      } else {
        setError(`Неверный пароль. Осталось попыток: ${MAX_ATTEMPTS - newAttempts}`);
      }
    }
    
    setPassword("");
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">🔐 Авторизация</CardTitle>
          <CardDescription>
            Защита паролем при входе на сайт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isBlocked}
                className="text-center"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isBlocked || !password}
            >
              {isBlocked ? "Заблокировано" : "Войти"}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Попытка {attempts}/{MAX_ATTEMPTS}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}