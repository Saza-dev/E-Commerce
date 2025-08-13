import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminUpdateRoleDto } from './dtos/admin-update-role.dto';
import { AdminUpdateStatusDto } from './dtos/admin-update-status.dto';
import { AdminListUsersDto } from './dtos/admin-list-users.dto';
import { AdminCreateUserDto } from './dtos/admin-create-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get()
  list(@Query() q: AdminListUsersDto) {
    return this.admin.listUsersPaged({
      page: Number(q.page) || 1,
      pageSize: Number(q.pageSize) || 20,
      q: q.q,
      sortBy: q.sortBy || 'createdAt',
      sortDir: (q.sortDir as any) || 'desc',
    });
  }

  @Post()
  createAdmin(@Body() dto: AdminCreateUserDto) {
    return this.admin.createAdmin(dto);
  }

  @Patch(':id/role')
  setRole(@Param('id') id: string, @Body() dto: AdminUpdateRoleDto) {
    return this.admin.setRole(id, dto.role);
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: AdminUpdateStatusDto) {
    return this.admin.setStatus(id, dto.status);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.admin.deleteUser(id);
  }
}
