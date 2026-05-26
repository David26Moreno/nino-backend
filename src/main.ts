import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  //app.use(cookieParser());
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Market Backend API')
    .setDescription(
      'API del sistema de gestión Market - Documentación completa de endpoints',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Endpoints de autenticación y autorización')
    .addTag('user', 'Gestión de usuarios')
    .addTag('category', 'Gestión de categorías')
    .addTag('product', 'Gestión de productos')
    .addTag('inventory', 'Gestión de inventario')
    .addTag('sale', 'Gestión de ventas')
    .addTag('reports', 'Reportes')
    .addTag('seed', 'Seed')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NINO AI Backend API',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('❌ Error al arrancar la aplicación:', err);
  process.exit(1);
});