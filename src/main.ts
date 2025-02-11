import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PoliciesGuard } from './auth/policies.guard';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // This will work both in dev and prod environment because create roles, permission and a default admin user
  // seedService.seed()
  app.useGlobalPipes(new ValidationPipe({transform: true}))
  
  const jwtAuthGuard = app.get(JwtAuthGuard)
  const policiesGuard = app.get(PoliciesGuard)

  app.useGlobalGuards(jwtAuthGuard)
  app.useGlobalGuards(policiesGuard)

  const config = new DocumentBuilder()
  .setTitle('E-commerce api')
  .setDescription('E-commerce simulation api')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  }

  const documentFactory = () => SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
