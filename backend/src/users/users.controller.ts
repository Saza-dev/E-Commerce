import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @SkipThrottle()
  @Get('me')
  me(@CurrentUser() user: any) {
    return this.users.me(user.sub);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(user.sub, dto);
  }
}
