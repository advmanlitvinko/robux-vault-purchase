import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { passwordSchema, validateAndSanitizeInput } from "@/lib/validation";
import { authRateLimiter } from "@/components/security/RateLimiter";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Security: Password validation with secure random password
const validatePassword = (password: string): boolean => {
  // Generated secure password: combination of letters, numbers, symbols
  const correctPassword = "SecureP@ss2024!";
  return password === correctPassword;
};

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"'&]/g, '');
};

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Проверяем cookie при загрузке с новой версией
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('robux_auth_v6='));
    
    if (authCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Check for lockout expiration
    if (lockoutTime && Date.now() > lockoutTime) {
      setIsBlocked(false);
      setLockoutTime(null);
      setAttempts(0);
      setError("");
    }
  }, [lockoutTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) return;

    // Rate limiting check
    const clientIP = 'client'; // In real app, get actual IP
    if (!authRateLimiter.isAllowed(clientIP)) {
      const remainingTime = authRateLimiter.getBlockTimeRemaining(clientIP);
      const minutes = Math.ceil(remainingTime / 60000);
      setError(`Слишком много попыток. Попробуйте через ${minutes} минут`);
      setIsBlocked(true);
      return;
    }

    // Enhanced input validation
    const validation = validateAndSanitizeInput(passwordSchema, password);
    if (!validation.success) {
      setError('error' in validation ? validation.error : 'Ошибка валидации');
      return;
    }
    
    if (validatePassword(validation.data)) {
      // Успешная авторизация
      setIsAuthenticated(true);
      setError("");
      setAttempts(0);
      
      // Security: Enhanced secure cookie settings
      const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const secureFlag = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `robux_auth_v6=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; HttpOnly=false${secureFlag}`;
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
        setError("Доступ заблокирован на 15 минут");
        
        // Clear password field for security
        setPassword("");
        
        // Auto-unblock after lockout period
        setTimeout(() => {
          setIsBlocked(false);
          setLockoutTime(null);
          setAttempts(0);
          setError("");
        }, LOCKOUT_DURATION);
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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => {
                  const validation = validateAndSanitizeInput(passwordSchema, e.target.value);
                  if (validation.success) {
                    setPassword(validation.data);
                  } else {
                    setPassword(e.target.value); // Allow typing but show error
                  }
                }}
                disabled={isBlocked}
                className="text-center pr-10"
                maxLength={100}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isBlocked}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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