/*
  Warnings:

  - Added the required column `allergens` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barcode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categories` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredients` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `novaScore` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutriScore` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packagingDetails` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productImage` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `data` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NutriScore" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "allergens" TEXT NOT NULL,
ADD COLUMN     "barcode" TEXT NOT NULL,
ADD COLUMN     "brandName" TEXT NOT NULL,
ADD COLUMN     "categories" TEXT NOT NULL,
ADD COLUMN     "ingredients" TEXT NOT NULL,
ADD COLUMN     "novaScore" INTEGER NOT NULL,
ADD COLUMN     "nutriScore" "NutriScore" NOT NULL,
ADD COLUMN     "packagingDetails" TEXT NOT NULL,
ADD COLUMN     "productImage" BYTEA NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ALTER COLUMN "data" SET NOT NULL;
