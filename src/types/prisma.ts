import { Prisma } from '@prisma/client';

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    symptoms: true;
    insights: true;
    journalEntries: true;
  };
}>;
