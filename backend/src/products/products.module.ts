import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, RolesGuard, JwtAuthGuard],
})
export class ProductsModule {}
