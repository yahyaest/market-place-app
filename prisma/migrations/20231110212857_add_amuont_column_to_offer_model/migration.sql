/*
  Warnings:

  - Added the required column `amount` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "amount" INTEGER NOT NULL;
