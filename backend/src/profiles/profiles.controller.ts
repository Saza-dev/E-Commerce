import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfilesController {
  constructor(private profiles: ProfilesService) {}

  @SkipThrottle()
  @Get()
  getMine(@CurrentUser() user: any) {
    return this.profiles.getMine(user.sub);
  }

  @Patch()
  updateMine(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.profiles.updateMine(user.sub, dto);
  }
}
