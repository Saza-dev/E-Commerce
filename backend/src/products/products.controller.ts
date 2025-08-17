import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateVariantDto } from './dtos/update-variant.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/products')
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/products/:id/variants/:variantId')
  updateVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(
      Number(productId),
      Number(variantId),
      dto,
    );
  }

  @Get('products')
  getProducts(
    @Query('category') category?: string,
    @Query('size') size?: string,
    @Query('color') color?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.productsService.getProducts({
      category,
      size,
      color,
      minPrice,
      maxPrice,
    });
  }

  @Get('products/:slug')
  getProductBySlug(@Param('slug') slug: string) {
    return this.productsService.getProductBySlug(slug);
  }

  @Get('products/:id/variant/:variantId/images')
  getVariantImages(@Param('variantId') variantId: string) {
    return this.productsService.getVariantImages(Number(variantId));
  }
}
