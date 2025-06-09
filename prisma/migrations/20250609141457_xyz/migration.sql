/*
  Warnings:

  - You are about to drop the column `blogContent` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `commentLikes` on the `BlogComments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "blogContent";

-- AlterTable
ALTER TABLE "BlogComments" DROP COLUMN "commentLikes";
