import { z } from 'zod';

// Input validation schemas for security
export const passwordSchema = z.string()
  .min(1, "Пароль не может быть пустым")
  .max(100, "Пароль слишком длинный")
  .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, "Недопустимые символы в пароле");

export const nicknameSchema = z.string()
  .min(1, "Никнейм не может быть пустым")
  .max(50, "Никнейм слишком длинный")
  .regex(/^[a-zA-Z0-9_-]*$/, "Никнейм может содержать только буквы, цифры, _ и -");

export const emailSchema = z.string()
  .email("Неверный формат email")
  .max(255, "Email слишком длинный");

export const amountSchema = z.number()
  .positive("Сумма должна быть положительной")
  .max(1000000, "Сумма слишком большая")
  .finite("Сумма должна быть числом");

// Sanitization functions
export const sanitizeText = (text: string): string => {
  return text.replace(/[<>\"'&]/g, '').trim();
};

export const sanitizeHTML = (html: string): string => {
  // Remove all HTML tags and potential XSS vectors
  return html.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').trim();
};

export const validateAndSanitizeInput = <T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const validatedData = schema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Ошибка валидации" };
    }
    return { success: false, error: "Неизвестная ошибка валидации" };
  }
};