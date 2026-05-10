/*
  Warnings:

  - You are about to drop the column `tokenHash` on the `PasswordResetToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `PasswordResetToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PasswordResetToken_tokenHash_key";

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "tokenHash",
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_slug_key" ON "PasswordResetToken"("slug");
