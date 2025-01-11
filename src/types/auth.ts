import { MenopauseStage } from '@prisma/client';

export type UserResponse = {
  id: string;
  email: string;
  name: string | null;
  menopauseStage: 'PERIMENOPAUSE' | 'MENOPAUSE' | 'POSTMENOPAUSE' | null;
  createdAt: Date;
};

export interface LoginCredentials {
  email: string;
  password: string;
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
}