import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { CartModal } from "@/components/cart/CartModal";

const navItems = [
  { name: "Купить", href: "#buy" },
  { name: "Инструкция", href: "#instructions" },
  { name: "Отзывы", href: "#reviews" },
  { name: "Поддержка", href: "#support" },
];

export function Header({ onCartCheckout, onOpenCart }: { onCartCheckout: (total: number, items: any[]) => void; onOpenCart: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const { state } = useCart();

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Логотип */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-robux-green to-accent">
            <span className="text-sm font-bold text-white">R</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-robux-green to-accent bg-clip-text text-transparent">
            Robuy
          </span>
        </div>

        {/* Навигация для десктопа */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>
          
          {/* Корзина */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenCart()}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-[18px] h-5 flex items-center justify-center"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>

        {/* Мобильное меню и корзина */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Корзина мобильная */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenCart()}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-[18px] h-5 flex items-center justify-center"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
          
          {/* Меню кнопка */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Мобильная навигация */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col space-y-2 px-4 py-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
      
      {/* Модальное окно корзины */}
      <CartModal
        isOpen={cartModal}
        onClose={() => setCartModal(false)}
        onCheckout={(total, items) => {
          setCartModal(false);
          onCartCheckout(total, items);
        }}
      />
    </header>
  );
}