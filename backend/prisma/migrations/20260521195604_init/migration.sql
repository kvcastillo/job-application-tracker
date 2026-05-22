-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "notes" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
