import { describe, it, expect } from '@jest/globals';
import { MenopauseStage } from '@prisma/client';
import {
  emailSchema,
  passwordSchema,
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validation';

describe('Email Schema Validation', () => {
  it('validates correct email formats', () => {
    expect(() => emailSchema.parse('user@example.com')).not.toThrow();
    expect(() =>
      emailSchema.parse('test.user+label@domain.co.uk')
    ).not.toThrow();
  });

  it('rejects invalid email formats', () => {
    expect(() => emailSchema.parse('')).toThrow('Email is required');
    expect(() => emailSchema.parse('invalid-email')).toThrow(
      'Invalid email format'
    );
    expect(() => emailSchema.parse('@nodomain.com')).toThrow(
      'Invalid email format'
    );
  });
});

describe('Password Schema Validation', () => {
  it('validates correct password formats', () => {
    expect(() => passwordSchema.parse('ValidPass1')).not.toThrow();
    expect(() => passwordSchema.parse('StrongPassword123')).not.toThrow();
  });

  it('rejects invalid password formats', () => {
    expect(() => passwordSchema.parse('short')).toThrow(
      'at least 8 characters'
    );
    expect(() => passwordSchema.parse('nouppercase1')).toThrow(
      'uppercase letter'
    );
    expect(() => passwordSchema.parse('NOLOWERCASE1')).toThrow(
      'lowercase letter'
    );
    expect(() => passwordSchema.parse('NoNumbers')).toThrow('one number');
  });
});

describe('Register Schema Validation', () => {
  const validRegisterData = {
    email: 'test@example.com',
    password: 'ValidPass1',
    name: 'Test User',
    menopauseStage: MenopauseStage.PERIMENOPAUSE,
  };

  it('validates complete registration data', () => {
    expect(() => registerSchema.parse(validRegisterData)).not.toThrow();
  });

  it('validates registration with minimal required fields', () => {
    const minimalData = {
      email: 'test@example.com',
      password: 'ValidPass1',
    };
    expect(() => registerSchema.parse(minimalData)).not.toThrow();
  });

  it('rejects invalid registration data', () => {
    expect(() =>
      registerSchema.parse({ ...validRegisterData, email: 'invalid-email' })
    ).toThrow();

    expect(() =>
      registerSchema.parse({ ...validRegisterData, password: 'short' })
    ).toThrow();
  });
});

describe('Login Schema Validation', () => {
  it('validates correct login credentials', () => {
    expect(() =>
      loginSchema.parse({
        email: 'test@example.com',
        password: 'somepassword',
      })
    ).not.toThrow();
  });

  it('rejects invalid login credentials', () => {
    expect(() =>
      loginSchema.parse({
        email: 'invalid-email',
        password: '',
      })
    ).toThrow();
  });
});

describe('Update Profile Schema Validation', () => {
  it('validates profile updates', () => {
    expect(() =>
      updateProfileSchema.parse({
        name: 'New Name',
        menopauseStage: MenopauseStage.MENOPAUSE,
      })
    ).not.toThrow();
  });

  it('validates partial updates', () => {
    expect(() => updateProfileSchema.parse({ name: 'New Name' })).not.toThrow();
    expect(() =>
      updateProfileSchema.parse({
        menopauseStage: MenopauseStage.POSTMENOPAUSE,
      })
    ).not.toThrow();
  });

  it('validates empty update', () => {
    expect(() => updateProfileSchema.parse({})).not.toThrow();
  });
});
