/*
  Warnings:

  - Added the required column `district` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "district" TEXT NOT NULL;
