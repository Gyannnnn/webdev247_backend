-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "blogDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorBio" TEXT NOT NULL,
    "authorLocation" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorAvatar" TEXT NOT NULL,
    "authorLinkedin" TEXT NOT NULL,
    "authorX" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);
