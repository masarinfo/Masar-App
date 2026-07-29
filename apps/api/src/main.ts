import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedDemoData } from './seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Seed data before starting
  await seedDemoData();

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Masar SaaS API Microservice running on port ${port}`);
}

bootstrap();
