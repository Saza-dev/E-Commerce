import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard)
@Controller()
export class AddressesController {
  constructor(private addresses: AddressesService) {}

  // ----- Customer (self) -----
  @SkipThrottle()
  @Get('addresses')
  listMine(@CurrentUser() user: any) {
    return this.addresses.listMine(user.sub);
  }

  @Post('addresses')
  createMine(@CurrentUser() user: any, @Body() dto: CreateAddressDto) {
    return this.addresses.createMine(user.sub, dto);
  }

  @Patch('addresses/:id')
  updateMine(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addresses.updateMine(user.sub, id, dto);
  }

  @Delete('addresses/:id')
  deleteMine(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addresses.deleteMine(user.sub, id);
  }

  @Patch('addresses/:id/default')
  setDefaultMine(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addresses.setDefaultMine(user.sub, id);
  }

  // ----- Admin -----
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('admin/addresses')
  listByUser(@Query('userId') userId: string) {
    return this.addresses.listByUser(userId);
  }
}
