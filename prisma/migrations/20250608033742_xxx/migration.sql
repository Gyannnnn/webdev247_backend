/*
  Warnings:

  - You are about to drop the column `accountId` on the `Blog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_accountId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "accountId",
ALTER COLUMN "blogContent" SET DATA TYPE TEXT;
