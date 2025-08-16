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
        children: true,
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        products: {
          include: {
            variants: {
              include: { images: true },
            },
          },
        },
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
