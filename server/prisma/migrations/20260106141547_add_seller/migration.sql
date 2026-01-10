-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "workEmail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'seller',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_workEmail_key" ON "Seller"("workEmail");
