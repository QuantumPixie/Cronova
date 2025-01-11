type RateLimitRecord = {
  attempts: number;
  resetTime: number;
};

const loginAttempts = new Map<string, RateLimitRecord>();

const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
};

export function checkRateLimit(identifier: string) {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (record && now > record.resetTime) {
    loginAttempts.delete(identifier);
  }

  const currentRecord = loginAttempts.get(identifier) || {
    attempts: 0,
    resetTime: now + RATE_LIMIT.windowMs,
  };

  currentRecord.attempts++;
  loginAttempts.set(identifier, currentRecord);

  return {
    success: currentRecord.attempts <= RATE_LIMIT.maxAttempts,
    remaining: Math.max(0, RATE_LIMIT.maxAttempts - currentRecord.attempts),
  };
}
