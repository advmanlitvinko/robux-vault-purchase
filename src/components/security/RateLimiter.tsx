// Rate limiting utility for client-side protection
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blocked: boolean;
  blockedUntil?: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000, blockDurationMs = 60 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        blocked: false
      });
      return true;
    }

    // Check if block period has expired
    if (entry.blocked && entry.blockedUntil && now > entry.blockedUntil) {
      this.attempts.delete(identifier);
      return true;
    }

    // If currently blocked
    if (entry.blocked) {
      return false;
    }

    // Reset window if enough time has passed
    if (now - entry.firstAttempt > this.windowMs) {
      entry.count = 1;
      entry.firstAttempt = now;
      entry.blocked = false;
      return true;
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > this.maxAttempts) {
      entry.blocked = true;
      entry.blockedUntil = now + this.blockDurationMs;
      return false;
    }

    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry || entry.blocked) return 0;
    return Math.max(0, this.maxAttempts - entry.count);
  }

  getBlockTimeRemaining(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry || !entry.blocked || !entry.blockedUntil) return 0;
    return Math.max(0, entry.blockedUntil - Date.now());
  }
}

export const authRateLimiter = new RateLimiter(3, 15 * 60 * 1000, 30 * 60 * 1000);