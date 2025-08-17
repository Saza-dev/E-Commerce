import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug || dto.name.toLowerCase().replace(/\s+/g, '-'),
        parentId: dto.parentId || null,
      },
    });
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        parentId: dto.parentId || null,
      },
    });
  }

  async deleteCategory(id: number) {
    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }

  async listCategories() {
    return this.prisma.category.findMany({
      include: { children: true },
    });
  }

  async listCategoriesWithSubcategories() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: { include: { children: true } },
          },
        },
      },
    });
  }

  async getCategoryProductsBySlug(slug: string) {
    const prisma = this.prisma;

    // Recursively get all descendant slugs
    async function getDescendantSlugs(currentSlug: string): Promise<string[]> {
      const children = await prisma.category.findMany({
        where: { parent: { slug: currentSlug } }, // find children by parent
        select: { slug: true },
      });

      let slugs: string[] = [];
      for (const child of children) {
        slugs.push(child.slug);
        slugs.push(...(await getDescendantSlugs(child.slug))); // recurse
      }

      return slugs;
    }

    const allSlugs = [slug, ...(await getDescendantSlugs(slug))];

    // Fetch all categories matching these slugs, including products
    const categories = await prisma.category.findMany({
      where: { slug: { in: allSlugs } },
      include: {
        products: {
          include: {
            variants: {
              include: { images: true },
            },
          },
        },
      },
    });

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Category not found');
    }

    // Optionally, merge products into one array
    const allProducts = categories.flatMap((cat) => cat.products);

    return allProducts;
  }
}
