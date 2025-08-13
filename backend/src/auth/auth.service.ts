import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { TokensService } from './tokens.service';
import { BcryptService } from '../common/hashing/bcrypt.service';
import { UserStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';

type RTClient = Prisma.TransactionClient | PrismaService;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private bcrypt: BcryptService,
    private tokens: TokensService,
    private cfg: ConfigService,
  ) {}

  // ---------- REGISTER (Customer) ----------
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await this.bcrypt.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role as 'CUSTOMER',
    };
    const { accessToken, refreshToken } =
      await this.tokens.generateTokens(payload);
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        name: user.name,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    };
  }

  // ---------- LOGIN (Admin or Customer) ----------
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Account is not active');
    }

    const ok = await this.bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'CUSTOMER',
    };
    const { accessToken, refreshToken } =
      await this.tokens.generateTokens(payload);
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        name: user.name,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    };
  }

  // ---------- REFRESH (Rotation) ----------
  async refreshTokens(userId: string, rawRefreshToken: string) {
    const hashed = this.tokens.hashToken(rawRefreshToken);

    // find a non-revoked, non-expired token for this user
    const tokenRow = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash: hashed,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!tokenRow) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Account is not active');
    }

    // rotate
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'CUSTOMER',
    };
    const { accessToken, refreshToken } =
      await this.tokens.generateTokens(payload);

    // revoke old & store new atomically
    await this.prisma.$transaction(async (tx) => {
      const newToken = await this.storeRefreshToken(user.id, refreshToken, tx);
      await tx.refreshToken.update({
        where: { id: tokenRow.id },
        data: { revokedAt: new Date(), replacedByTokenId: newToken.id },
      });
    });

    return { accessToken, refreshToken };
  }

  // ---------- LOGOUT (single session) ----------
  async logout(userId: string, rawRefreshToken: string) {
    const hashed = this.tokens.hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { userId, tokenHash: hashed, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  // ---------- LOGOUT ALL ----------
  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  // ---------- helpers ----------
  private async storeRefreshToken(
    userId: string,
    rawToken: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client: RTClient = tx ?? this.prisma;

    const hashed = this.tokens.hashToken(rawToken);
    const refreshExp = this.cfg.get<string>('JWT_REFRESH_EXPIRES') || '7d';
    const { value, unit } = this.parseDuration(refreshExp);
    const expiresAt = dayjs().add(value, unit).toDate();

    return client.refreshToken.create({
      data: {
        userId,
        tokenHash: hashed,
        expiresAt,
      },
      select: { id: true },
    });
  }

  // very small duration parser: "15m" | "7d" | "1h"
  private parseDuration(input: string): {
    value: number;
    unit: dayjs.ManipulateType;
  } {
    const m = input.match(/^(\d+)\s*([smhdw])$/i);
    if (!m) return { value: 7, unit: 'day' };
    const n = parseInt(m[1], 10);
    const unitMap: Record<string, dayjs.ManipulateType> = {
      s: 'second',
      m: 'minute',
      h: 'hour',
      d: 'day',
      w: 'week',
    };
    return { value: n, unit: unitMap[m[2].toLowerCase()] ?? 'day' };
  }

  // ---------- REQUEST PASSWORD RESET ----------
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always respond OK to avoid user enumeration
    if (!user) return { success: true };

    // Create a random token and store its hash with short expiry (e.g., 30 min)
    const raw = this.tokens.generateRandomToken(32);
    const tokenHash = this.tokens.hashToken(raw);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // (Optionally: revoke previous unused tokens)
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // TODO: send email with link containing `raw` token
    // For now, return it for testing
    return { success: true, resetToken: raw };
  }

  // ---------- PERFORM PASSWORD RESET ----------
  async performPasswordReset(rawToken: string, newPassword: string) {
    const tokenHash = this.tokens.hashToken(rawToken);

    const token = await this.prisma.passwordResetToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!token) {
      // token invalid / expired / already used
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Update password and revoke all refresh tokens
    const passwordHash = await this.bcrypt.hash(newPassword);
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: token.userId },
        data: { passwordHash },
      });
      await tx.refreshToken.updateMany({
        where: { userId: token.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await tx.passwordResetToken.update({
        where: { id: token.id },
        data: { usedAt: new Date() },
      });
    });

    return { success: true };
  }
}
