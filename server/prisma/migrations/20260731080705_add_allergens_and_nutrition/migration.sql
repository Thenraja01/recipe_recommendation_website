/*
  Warnings:

  - You are about to drop the `BlogComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restaurant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_blogId_fkey";

-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "MenuCategory" DROP CONSTRAINT "MenuCategory_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_ownerId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "allergens" TEXT[],
ADD COLUMN     "calcium" INTEGER,
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "carbs" INTEGER,
ADD COLUMN     "cholesterol" INTEGER,
ADD COLUMN     "dietLabels" TEXT[],
ADD COLUMN     "fat" INTEGER,
ADD COLUMN     "fiber" INTEGER,
ADD COLUMN     "healthLabels" TEXT[],
ADD COLUMN     "iron" INTEGER,
ADD COLUMN     "protein" INTEGER,
ADD COLUMN     "saturatedFat" INTEGER,
ADD COLUMN     "sodium" INTEGER,
ADD COLUMN     "sugar" INTEGER,
ADD COLUMN     "transFat" INTEGER,
ADD COLUMN     "vitaminA" INTEGER,
ADD COLUMN     "vitaminC" INTEGER;

-- AlterTable
ALTER TABLE "UserPreference" ADD COLUMN     "allergens" TEXT[];

-- DropTable
DROP TABLE "BlogComment";

-- DropTable
DROP TABLE "MenuCategory";

-- DropTable
DROP TABLE "MenuItem";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Restaurant";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentStatus";
