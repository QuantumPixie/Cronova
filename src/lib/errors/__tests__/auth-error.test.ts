import { describe, it, expect } from '@jest/globals';
import { AuthError } from '../auth-error';

describe('AuthError', () => {
  describe('constructor', () => {
    it('creates an error with default status', () => {
      const error = new AuthError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.name).toBe('AuthError');
    });

    it('creates an error with custom status and code', () => {
      const error = new AuthError('Test error', 403, 'forbidden');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(403);
      expect(error.code).toBe('forbidden');
    });

    it('extends Error class', () => {
      const error = new AuthError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthError);
    });
  });

  describe('static methods', () => {
    it('creates unauthorized error', () => {
      const error = AuthError.unauthorized();
      expect(error.message).toBe('Unauthorized');
      expect(error.status).toBe(401);
      expect(error.code).toBe('unauthorized');
    });

    it('creates unauthorized error with custom message', () => {
      const error = AuthError.unauthorized('Custom unauthorized');
      expect(error.message).toBe('Custom unauthorized');
      expect(error.status).toBe(401);
      expect(error.code).toBe('unauthorized');
    });

    it('creates invalid credentials error', () => {
      const error = AuthError.invalidCredentials();
      expect(error.message).toBe('Invalid email or password');
      expect(error.status).toBe(401);
      expect(error.code).toBe('invalid_credentials');
    });

    it('creates account not found error', () => {
      const error = AuthError.accountNotFound();
      expect(error.message).toBe('No account found with this email address');
      expect(error.status).toBe(404);
      expect(error.code).toBe('account_not_found');
    });

    it('creates rate limit exceeded error', () => {
      const error = AuthError.rateLimitExceeded(2);
      expect(error.message).toBe(
        'Too many login attempts. Please try again in 15 minutes. 2 attempts remaining.'
      );
      expect(error.status).toBe(429);
      expect(error.code).toBe('rate_limit_exceeded');
    });
  });

  describe('error handling', () => {
    it('can be caught as a regular error', () => {
      expect(() => {
        throw new AuthError('Test error');
      }).toThrow(Error);
    });

    it('can be caught specifically as AuthError', () => {
      expect(() => {
        throw new AuthError('Test error');
      }).toThrow(AuthError);
    });

    it('preserves error properties when caught', () => {
      try {
        throw new AuthError('Test error', 403, 'test_code');
      } catch (error) {
        if (error instanceof AuthError) {
          expect(error.message).toBe('Test error');
          expect(error.status).toBe(403);
          expect(error.code).toBe('test_code');
        }
      }
    });
  });
});
