/*
  Warnings:

  - A unique constraint covering the columns `[blogNotionId]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Blog_blogNotionId_key" ON "Blog"("blogNotionId");
