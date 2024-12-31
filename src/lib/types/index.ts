import { Prisma } from '@prisma/client';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: string;
  email: string;
  name: string | null;
  menopauseStage: 'PERIMENOPAUSE' | 'MENOPAUSE' | 'POSTMENOPAUSE' | null;
  createdAt: Date;
};

export type SymptomFormData = {
  date: Date;
  hotFlashes: number;
  nightSweats: number;
  moodSwings: number;
  sleepIssues: number;
  anxiety: number;
  fatigue: number;
  intensity: 'MILD' | 'MODERATE' | 'SEVERE';
  notes?: string;
};
export type SymptomResponse = SymptomFormData & {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type JournalFormData = {
  date: Date;
  mood: 'GREAT' | 'GOOD' | 'NEUTRAL' | 'LOW' | 'BAD';
  sleep: number;
  exercise?: boolean;
  diet?: string[];
  stress?: number;
  notes?: string;
};

export type JournalResponse = JournalFormData & {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsightFormData = {
  date: Date;
  content: string;
  recommendations: string[];
  source: string;
  associatedSymptoms: string[];
};

export type InsightResponse = InsightFormData & {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    symptoms: true;
    insights: true;
    journalEntries: true;
  };
}>;

export type SymptomWithUser = Prisma.SymptomEntryGetPayload<{
  include: {
    user: true;
  };
}>;

export type JournalWithUser = Prisma.JournalEntryGetPayload<{
  include: {
    user: true;
  };
}>;

export type InsightWithUser = Prisma.InsightGetPayload<{
  include: {
    user: true;
  };
}>;

export type AuthResponse = ApiResponse<{
  user: UserResponse;
  token?: string;
}>;

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;
