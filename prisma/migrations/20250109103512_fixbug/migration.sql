/*
  Warnings:

  - The primary key for the `Base` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Base` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Table` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `baseId` on the `Table` table. All the data in the column will be lost.
  - The `id` column on the `Table` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `View` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `baseId` on the `View` table. All the data in the column will be lost.
  - You are about to drop the column `tableId` on the `View` table. All the data in the column will be lost.
  - The `id` column on the `View` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `baseid` to the `Table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableid` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_baseId_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_baseId_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_tableId_fkey";

-- AlterTable
ALTER TABLE "Base" DROP CONSTRAINT "Base_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Base_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Table" DROP CONSTRAINT "Table_pkey",
DROP COLUMN "baseId",
ADD COLUMN     "baseid" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Table_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "View" DROP CONSTRAINT "View_pkey",
DROP COLUMN "baseId",
DROP COLUMN "tableId",
ADD COLUMN     "tableid" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "View_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_baseid_fkey" FOREIGN KEY ("baseid") REFERENCES "Base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_tableid_fkey" FOREIGN KEY ("tableid") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
