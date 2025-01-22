import { checkRateLimit } from '../rate-limit-service';

describe('Rate Limit Service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows initial login attempts', () => {
    const identifier = 'test@example.com';

    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(identifier);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4 - i);
    }
  });

  it('blocks attempts after max limit is reached', () => {
    const identifier = 'blocked@example.com';

    for (let i = 0; i < 5; i++) {
      checkRateLimit(identifier);
    }

    const result = checkRateLimit(identifier);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets rate limit after window period', () => {
    const identifier = 'reset@example.com';

    for (let i = 0; i < 5; i++) {
      checkRateLimit(identifier);
    }

    const result1 = checkRateLimit(identifier);
    expect(result1.success).toBe(false);

    jest.advanceTimersByTime(15 * 60 * 1000 + 1);

    const result2 = checkRateLimit(identifier);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(4);
  });

  it('handles multiple different identifiers independently', () => {
    const identifier1 = 'user1@example.com';
    const identifier2 = 'user2@example.com';

    for (let i = 0; i < 5; i++) {
      checkRateLimit(identifier1);
    }

    const result1 = checkRateLimit(identifier1);
    expect(result1.success).toBe(false);

    const result2 = checkRateLimit(identifier2);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(4);
  });

  it('correctly calculates remaining attempts', () => {
    const identifier = 'attempts@example.com';

    const result1 = checkRateLimit(identifier);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(4);

    const result2 = checkRateLimit(identifier);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(3);
  });

  it('handles edge case of exactly 5 attempts', () => {
    const identifier = 'edge@example.com';

    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(identifier);
      expect(result.success).toBe(true);
    }

    const finalResult = checkRateLimit(identifier);
    expect(finalResult.success).toBe(false);
    expect(finalResult.remaining).toBe(0);
  });
});
