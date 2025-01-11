export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }

  static unauthorized(message = 'Unauthorized'): AuthError {
    return new AuthError(message, 401, 'unauthorized');
  }

  static invalidCredentials(): AuthError {
    return new AuthError(
      'Invalid email or password',
      401,
      'invalid_credentials'
    );
  }

  static accountNotFound(): AuthError {
    return new AuthError(
      'No account found with this email address',
      404,
      'account_not_found'
    );
  }

  static rateLimitExceeded(remaining: number): AuthError {
    return new AuthError(
      `Too many login attempts. Please try again in 15 minutes. ${remaining} attempts remaining.`,
      429,
      'rate_limit_exceeded'
    );
  }
}
