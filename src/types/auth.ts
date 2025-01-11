import { MenopauseStage } from '@prisma/client';

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  menopauseStage: MenopauseStage | null;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  menopauseStage: MenopauseStage | null;
}

export interface RateLimitResponse {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export interface AuthError {
  error: string;
  status: number;
}

export type AuthResponse = {
  success: boolean;
  data?: AuthenticatedUser;
  error?: string;
  rateLimitInfo?: RateLimitResponse;
};
