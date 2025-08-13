import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  listMine(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ type: 'asc' }, { isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createMine(userId: string, dto: CreateAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.address.updateMany({
          where: { userId, type: dto.type, isDefault: true },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: { userId, ...dto, isDefault: !!dto.isDefault },
      });
    });
  }

  async updateMine(userId: string, id: string, dto: UpdateAddressDto) {
    const addr = await this.prisma.address.findUnique({ where: { id } });
    if (!addr) throw new NotFoundException('Address not found');
    if (addr.userId !== userId)
      throw new ForbiddenException('Not your address');

    // If making default (and possibly changing type), clear previous default for that type
    return this.prisma.$transaction(async (tx) => {
      const nextType = dto.type ?? addr.type;
      if (dto.isDefault === true) {
        await tx.address.updateMany({
          where: { userId, type: nextType, isDefault: true },
          data: { isDefault: false },
        });
      }
      return tx.address.update({
        where: { id },
        data: { ...dto },
      });
    });
  }

  async deleteMine(userId: string, id: string) {
    const addr = await this.prisma.address.findUnique({ where: { id } });
    if (!addr) throw new NotFoundException('Address not found');
    if (addr.userId !== userId)
      throw new ForbiddenException('Not your address');

    await this.prisma.address.delete({ where: { id } });
    return { success: true };
  }

  // Admin helpers
  listByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ type: 'asc' }, { isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async setDefaultMine(userId: string, id: string) {
    const addr = await this.prisma.address.findUnique({ where: { id } });
    if (!addr) throw new NotFoundException('Address not found');
    if (addr.userId !== userId)
      throw new ForbiddenException('Not your address');

    await this.prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, type: addr.type, isDefault: true },
        data: { isDefault: false },
      });
      await tx.address.update({ where: { id }, data: { isDefault: true } });
    });

    return { success: true };
  }
}
