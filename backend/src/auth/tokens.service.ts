import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

type JwtPayload = { sub: string; email: string; role: 'ADMIN' | 'CUSTOMER' };

@Injectable()
export class TokensService {
  constructor(
    private jwt: JwtService,
    private cfg: ConfigService,
  ) {}

  signAccessToken(payload: JwtPayload) {
    return this.jwt.signAsync(payload, {
      secret: this.cfg.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.cfg.get<string>('JWT_ACCESS_EXPIRES') || '15m',
    });
  }

  signRefreshToken(payload: JwtPayload) {
    return this.jwt.signAsync(payload, {
      secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.cfg.get<string>('JWT_REFRESH_EXPIRES') || '7d',
    });
  }

  async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }

  hashToken(raw: string): string {
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  async verifyRefresh(token: string) {
    return this.jwt.verifyAsync(token, {
      secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  generateRandomToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }
}
