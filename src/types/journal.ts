import { Prisma } from '@prisma/client';

export type JournalFormData = {
  date: string;
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

export type JournalWithUser = Prisma.JournalEntryGetPayload<{
  include: {
    user: true;
  };
}>;
