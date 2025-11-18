/*
  Warnings:

  - You are about to drop the column `name` on the `stalls` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerDay` on the `stalls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stallName]` on the table `stalls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `features` to the `stalls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idealFor` to the `stalls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `stalls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stallName` to the `stalls` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "stalls_name_key";

-- AlterTable
ALTER TABLE "stalls" DROP COLUMN "name",
DROP COLUMN "pricePerDay",
ADD COLUMN     "features" TEXT NOT NULL,
ADD COLUMN     "idealFor" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stallName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "stalls_stallName_key" ON "stalls"("stallName");
