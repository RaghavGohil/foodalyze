/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SearchHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserInformation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SearchHistory" DROP CONSTRAINT "SearchHistory_productId_fkey";

-- DropForeignKey
ALTER TABLE "SearchHistory" DROP CONSTRAINT "SearchHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserInformation" DROP CONSTRAINT "UserInformation_userId_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "SearchHistory";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserInformation";

-- DropEnum
DROP TYPE "ActivityLevel";

-- DropEnum
DROP TYPE "DietaryPreference";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "HealthCondition";
