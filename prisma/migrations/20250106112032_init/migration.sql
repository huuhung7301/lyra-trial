/*
  Warnings:

  - You are about to drop the column `baseId` on the `Table` table. All the data in the column will be lost.
  - Added the required column `baseid` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_baseId_fkey";

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "baseId",
ADD COLUMN     "baseid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_baseid_fkey" FOREIGN KEY ("baseid") REFERENCES "Base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
