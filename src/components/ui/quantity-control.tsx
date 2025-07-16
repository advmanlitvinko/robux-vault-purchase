import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAdd: () => void;
  maxQuantity?: number;
  isInCart: boolean;
}

export const QuantityControl = ({
  quantity,
  onIncrease,
  onDecrease,
  onAdd,
  maxQuantity = 100,
  isInCart
}: QuantityControlProps) => {
  if (!isInCart) {
    return (
      <Button
        onClick={onAdd}
        variant="outline"
        className="w-full bg-background/50 hover:bg-background border-primary/20 text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-200"
      >
        Добавить в корзину
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <Button
        onClick={onDecrease}
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 border-primary/20 hover:bg-primary hover:text-primary-foreground"
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <span className="text-sm font-medium min-w-[2rem] text-center">
        {quantity}
      </span>
      
      <Button
        onClick={onIncrease}
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 border-primary/20 hover:bg-primary hover:text-primary-foreground"
        disabled={quantity >= maxQuantity}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};