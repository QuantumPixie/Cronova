import { Prisma } from '@prisma/client';

export type SymptomFormData = {
  date: string;
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

export type SymptomWithUser = Prisma.SymptomEntryGetPayload<{
  include: {
    user: true;
  };
}>;
