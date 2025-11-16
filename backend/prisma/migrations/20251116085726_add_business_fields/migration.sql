/*
  Warnings:

  - You are about to drop the column `buisnessName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "buisnessName",
ADD COLUMN     "businessName" TEXT;
