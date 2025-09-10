import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { OrdersService } from './orders.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { OrderStatus } from '@prisma/client';

@Controller()
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // ===== Customer/Admin: place order (uses current user from JWT) =====
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER', 'ADMIN')
  @Post('orders')
  place(@Body() dto: PlaceOrderDto) {
    return this.orders.placeOrder(dto);
  }

  // ===== Customer/Admin: get single order =====
  // - Customer: can only view own order
  // - Admin: can view any order
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER', 'ADMIN')
  @Get('orders/:id')
  getOne(@Param('id') id: string) {
    return this.orders.getOrderById(id);
  }

  // ===== Customer/Admin: list my orders =====
  // - Customer: always lists own orders (ignores query userId)
  // - Admin: can pass ?userId=... to see someone else's orders
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER', 'ADMIN')
  @Get('orders/all/:userId')
  my(@Param('id') userId: string) {
    return this.orders.listOrdersForUser(userId);
  }

  // ========================= Admin endpoints ==========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/orders')
  adminList(
    @Query('status') status?: OrderStatus,
    @Query('userId') userId?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.orders.adminListOrders({
      status,
      userId,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/orders/:id')
  adminGetOne(@Param('id') id: string) {
    return this.orders.adminGetOrderById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/orders/:id/status')
  adminUpdateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orders.adminUpdateOrderStatus(id, dto.status);
  }
}
