import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminUpdateRoleDto } from './dtos/admin-update-role.dto';
import { AdminUpdateStatusDto } from './dtos/admin-update-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.admin.listUsers(
      parseInt(page, 10) || 1,
      parseInt(pageSize, 10) || 20,
    );
  }

  @Patch(':id/role')
  setRole(@Param('id') id: string, @Body() dto: AdminUpdateRoleDto) {
    return this.admin.setRole(id, dto.role);
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: AdminUpdateStatusDto) {
    return this.admin.setStatus(id, dto.status);
  }
}
