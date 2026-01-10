-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('music', 'tech', 'sports', 'comedy', 'education', 'business', 'other');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('upcoming', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "EventCategory" NOT NULL DEFAULT 'other',
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "imagePublicId" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER NOT NULL,
    "ticketsSold" INTEGER NOT NULL DEFAULT 0,
    "status" "EventStatus" NOT NULL DEFAULT 'upcoming',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
