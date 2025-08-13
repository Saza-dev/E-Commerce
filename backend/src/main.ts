import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/exceptions/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow your Next.js dev origins
  const allowed = (
    process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:3001'
  )
    .split(',')
    .map((s) => s.trim());

  app.enableCors({
    origin: (origin, cb) => {
      // allow server-to-server and tools (no Origin header)
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // we use Authorization header, not cookies
    maxAge: 86400, // cache preflight
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }, // <-- convert "1" -> 1
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(3000);
}
bootstrap();
