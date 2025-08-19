import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateVariantDto } from './dtos/update-variant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateVariantDto } from './dtos/create-variant.dto';

@Controller()
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/variants')
  createProduct(@Body() dto: CreateVariantDto) {
    return this.variantsService.createVariant(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/products/:id/variants/:variantId')
  updateVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.variantsService.updateVariant(
      Number(productId),
      Number(variantId),
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/variants/:id')
  deleteProduct(@Param('id') id: string) {
    return this.variantsService.deleteVariant(+id);
  }
}
