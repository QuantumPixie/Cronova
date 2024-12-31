export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a uppercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain a special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (
  name: string
): {
  isValid: boolean;
  error?: string;
} => {
  if (name.length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters',
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: 'Name must be at most 50 characters',
    };
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      isValid: false,
      error: 'Name contains invalid characters',
    };
  }

  return {
    isValid: true,
  };
};
