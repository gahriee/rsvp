import { RateLimitStatus } from "@/lib/types";

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitStatus {
  const now = Date.now();

  // Clean up expired entries periodically or when store grows
  if (rateLimitStore.size > 50) {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now >= entry.expiresAt) {
        rateLimitStore.delete(key);
      }
    }
  }

  const existing = rateLimitStore.get(identifier);

  if (!existing || now >= existing.expiresAt) {
    const reset = now + windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      expiresAt: reset,
    });
    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - 1),
      reset,
    };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: existing.expiresAt,
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    reset: existing.expiresAt,
  };
}

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
