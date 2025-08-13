import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getMine(userId: string) {
    const [user, profile] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
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
      this.prisma.customerProfile.findUnique({ where: { userId } }),
    ]);
    return { user, profile };
  }

  async updateMine(userId: string, dto: UpdateProfileDto) {
    const { name, phone, dateOfBirth, gender, avatarUrl, notes } = dto;

    return this.prisma.$transaction(async (tx) => {
      const updatedUser =
        name !== undefined || phone !== undefined
          ? await tx.user.update({
              where: { id: userId },
              data: { name, phone },
              select: {
                id: true,
                email: true,
                role: true,
                status: true,
                name: true,
                phone: true,
                updatedAt: true,
              },
            })
          : await tx.user.findUnique({
              where: { id: userId },
              select: {
                id: true,
                email: true,
                role: true,
                status: true,
                name: true,
                phone: true,
                updatedAt: true,
              },
            });

      const updatedProfile = await tx.customerProfile.upsert({
        where: { userId },
        create: {
          userId,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender: gender as any,
          avatarUrl,
          notes,
        },
        update: {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender: gender as any,
          avatarUrl,
          notes,
        },
      });

      return { user: updatedUser, profile: updatedProfile };
    });
  }
}
