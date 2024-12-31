import { Prisma } from '@prisma/client';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
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

export type JournalFormData = {
  date: Date;
  mood: 'GREAT' | 'GOOD' | 'NEUTRAL' | 'LOW' | 'BAD';
  sleep: number;
  exercise?: boolean;
  diet?: string[];
  stress?: number;
  notes?: string;
};

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    symptoms: true;
    insights: true;
    journalEntries: true;
  };
}>;
