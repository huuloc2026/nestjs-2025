-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('USER', 'MOD', 'ADMIN');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "uuid" TEXT,
    "verificationCode" TEXT,
    "secretKey" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "GENDER" NOT NULL DEFAULT 'OTHER',
    "phoneNumber" TEXT,
    "address" TEXT,
    "avatar" TEXT,
    "role" "ROLE" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
