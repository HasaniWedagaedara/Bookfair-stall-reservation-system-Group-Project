-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_genres" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "reservation_genres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_genres_reservationId_genreId_key" ON "reservation_genres"("reservationId", "genreId");

-- AddForeignKey
ALTER TABLE "reservation_genres" ADD CONSTRAINT "reservation_genres_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_genres" ADD CONSTRAINT "reservation_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
