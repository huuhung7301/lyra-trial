/*
  Warnings:

  - You are about to drop the column `assignee` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Table` table. All the data in the column will be lost.
  - Added the required column `data` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Table" DROP COLUMN "assignee",
DROP COLUMN "name",
DROP COLUMN "notes",
DROP COLUMN "status",
ADD COLUMN     "data" JSONB NOT NULL;
