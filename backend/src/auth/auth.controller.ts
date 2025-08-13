import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshDto } from './dtos/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestPasswordResetDto } from './dtos/request-password-reset.dto';
import { PerformPasswordResetDto } from './dtos/perform-password-reset.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Throttle({ register: { limit: 5, ttl: 60_000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Throttle({ login: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    // decode refresh to get sub; then rotate
    // (same as your current implementation)
    const payload = await this.auth['tokens']['jwt'].verifyAsync(
      dto.refreshToken,
      {
        secret: this.auth['tokens']['cfg'].get('JWT_REFRESH_SECRET'),
      },
    );
    return this.auth.refreshTokens(payload.sub, dto.refreshToken);
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Body() dto: RefreshDto) {
    const payload = await this.auth['tokens']['jwt'].verifyAsync(
      dto.refreshToken,
      {
        secret: this.auth['tokens']['cfg'].get('JWT_REFRESH_SECRET'),
      },
    );
    return this.auth.logout(payload.sub, dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout-all')
  async logoutAll(@CurrentUser() user: any) {
    return this.auth.logoutAll(user.sub);
  }

  @Post('request-password-reset')
  @HttpCode(200)
  async requestPassword(@Body() dto: RequestPasswordResetDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: PerformPasswordResetDto) {
    return this.auth.performPasswordReset(dto.token, dto.newPassword);
  }
}
