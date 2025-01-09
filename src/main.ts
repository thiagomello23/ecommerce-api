import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seedService = app.get(SeedService)
  // This will work both in dev and prod environment because create roles, permission and a default admin user
  seedService.seed()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
