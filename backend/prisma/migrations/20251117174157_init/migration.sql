/*
  Warnings:

  - You are about to drop the column `stallName` on the `stalls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `stalls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `stalls` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "stalls_stallName_key";

-- AlterTable
ALTER TABLE "stalls" DROP COLUMN "stallName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "stalls_name_key" ON "stalls"("name");
