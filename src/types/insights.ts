import { Prisma } from '@prisma/client';

export type InsightFormData = {
  date: string;
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

export type InsightWithUser = Prisma.InsightGetPayload<{
  include: {
    user: true;
  };
}>;
