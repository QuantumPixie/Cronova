-- AlterTable
ALTER TABLE "User" ADD COLUMN     "periodDates" TEXT[] DEFAULT ARRAY[]::TEXT[];
