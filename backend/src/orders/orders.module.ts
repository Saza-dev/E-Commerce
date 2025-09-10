import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, RolesGuard, JwtAuthGuard],
})
export class OrdersModule {}
