import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/:id')
  async getCart(@Param('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add/:id')
  async addToCart(@Param('id') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('update/:id')
  async updateCart(@Param('id') userId: string, @Body() dto: UpdateCartDto) {
    return this.cartService.updateCart(userId, dto);
  }

  @Delete('remove/:id')
  async removeFromCart(
    @Param('id') userId: string,
    @Body() dto: RemoveFromCartDto,
  ) {
    await this.cartService.removeFromCart(userId, dto);
    return { success: true };
  }
}
