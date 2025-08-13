import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AdminCreateUserDto } from './dtos/admin-create-user.dto';
import { Prisma } from '@prisma/client';
import { BcryptService } from '../common/hashing/bcrypt.service';

type Sortable = 'createdAt' | 'email' | 'role' | 'status';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private bcrypt: BcryptService,
  ) {}

  async listUsersPaged(params: {
    page?: number;
    pageSize?: number;
    q?: string;
    sortBy?: Sortable;
    sortDir?: Prisma.SortOrder;
  }) {
    const {
      page = 1,
      pageSize = 20,
      q,
      sortBy = 'createdAt',
      sortDir = 'desc',
    } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.UserWhereInput | undefined = q
      ? {
          OR: [
            { email: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortDir },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          name: true,
          phone: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async setRole(userId: string, role: 'ADMIN' | 'CUSTOMER') {
    const user = await this.prisma.user
      .update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          name: true,
          phone: true,
          createdAt: true,
        },
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
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          name: true,
          phone: true,
          createdAt: true,
        },
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

  async deleteUser(userId: string) {
    // clean up dependent rows then delete user
    await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({ where: { userId } }).catch(() => {});
      await tx.passwordResetToken
        ?.deleteMany?.({ where: { userId } })
        .catch(() => {});
      // Addresses & CustomerProfile use onDelete: Cascade in your schema
      await tx.user.delete({ where: { id: userId } });
    });
    return { success: true };
  }

  async createAdmin(dto: AdminCreateUserDto) {
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
        role: 'ADMIN',
        status: 'ACTIVE',
      },
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
    return user;
  }
}
