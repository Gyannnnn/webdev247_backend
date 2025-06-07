/*
  Warnings:

  - Added the required column `mainTag` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "mainTag" TEXT NOT NULL,
ADD COLUMN     "relatedBlogs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "relatedTags" TEXT[];
