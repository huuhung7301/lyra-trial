/*
  Warnings:

  - You are about to drop the column `data` on the `Table` table. All the data in the column will be lost.
  - Added the required column `tableData` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Table" DROP COLUMN "data",
ADD COLUMN     "tableData" JSONB NOT NULL;
