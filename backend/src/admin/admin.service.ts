import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  listUsers(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    return this.prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  async setRole(userId: string, role: 'ADMIN' | 'CUSTOMER') {
    const user = await this.prisma.user
      .update({
        where: { id: userId },
        data: { role },
        select: { id: true, email: true, role: true, status: true },
      })
      .catch(() => null);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async setStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED') {
    const user = await this.prisma.user
      .update({
        where: { id: userId },
        data: { status },
        select: { id: true, email: true, role: true, status: true },
      })
      .catch(() => null);
    if (!user) throw new NotFoundException('User not found');

    if (status === 'SUSPENDED') {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return user;
  }
}
