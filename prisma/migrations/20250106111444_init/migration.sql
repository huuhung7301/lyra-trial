/*
  Warnings:

  - You are about to drop the column `createdDate` on the `Base` table. All the data in the column will be lost.
  - You are about to drop the column `lastOpened` on the `Base` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `tableData` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Table` table. All the data in the column will be lost.
  - Added the required column `tabledata` to the `Table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedat` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Base" DROP COLUMN "createdDate",
DROP COLUMN "lastOpened",
ADD COLUMN     "createddate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastopened" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "createdAt",
DROP COLUMN "tableData",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tabledata" JSONB NOT NULL,
ADD COLUMN     "updatedat" TIMESTAMP(3) NOT NULL;
