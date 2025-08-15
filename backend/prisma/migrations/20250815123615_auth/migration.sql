/*
  Warnings:

  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AvailabilityFlag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VariantAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AttributeValue" DROP CONSTRAINT "AttributeValue_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AvailabilityFlag" DROP CONSTRAINT "AvailabilityFlag_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inventory" DROP CONSTRAINT "Inventory_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Price" DROP CONSTRAINT "Price_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VariantAttribute" DROP CONSTRAINT "VariantAttribute_attributeValueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VariantAttribute" DROP CONSTRAINT "VariantAttribute_variantId_fkey";

-- DropTable
DROP TABLE "public"."Attribute";

-- DropTable
DROP TABLE "public"."AttributeValue";

-- DropTable
DROP TABLE "public"."AvailabilityFlag";

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."Inventory";

-- DropTable
DROP TABLE "public"."Price";

-- DropTable
DROP TABLE "public"."Product";

-- DropTable
DROP TABLE "public"."ProductImage";

-- DropTable
DROP TABLE "public"."Variant";

-- DropTable
DROP TABLE "public"."VariantAttribute";
