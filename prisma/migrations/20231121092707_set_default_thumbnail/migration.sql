/*
  Warnings:

  - Made the column `thumbnail` on table `bookmarks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bookmarks" ALTER COLUMN "thumbnail" SET NOT NULL,
ALTER COLUMN "thumbnail" SET DEFAULT 'thumbnail.jpg';
