/*
  Warnings:

  - You are about to drop the column `mainTag` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `blogCatagory` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blogDescription` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "mainTag",
ADD COLUMN     "blogCatagory" TEXT NOT NULL,
ADD COLUMN     "blogDescription" TEXT NOT NULL;
