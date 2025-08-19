import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { AddressesModule } from './addresses/addresses.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/varinats.module';

const throttlers =
  process.env.NODE_ENV === 'production'
    ? [
        { ttl: 60_000, limit: 60 },
        { name: 'register', ttl: 60_000, limit: 5 },
        { name: 'login', ttl: 60_000, limit: 10 },
      ]
    : [
        { ttl: 60_000, limit: 1000 },
        { name: 'register', ttl: 60_000, limit: 100 },
        { name: 'login', ttl: 60_000, limit: 200 },
      ];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot(throttlers),
    PrismaModule,
    AuthModule,
    UsersModule,
    AdminModule,
    AddressesModule,
    ProfilesModule,
    CategoriesModule,
    ProductsModule,
    VariantsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
