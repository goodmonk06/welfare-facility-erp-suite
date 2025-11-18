import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS設定
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // バリデーションパイプ
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Swagger設定
  const config = new DocumentBuilder()
    .setTitle('Welfare Facility ERP API')
    .setDescription('介護・福祉事業所向けERP システムAPI')
    .setVersion('0.1.0')
    .addTag('residents', '利用者管理')
    .addTag('staff', '職員管理')
    .addTag('shifts', 'シフト管理')
    .addTag('incidents', 'インシデント報告')
    .addTag('claims', '請求管理')
    .addTag('tasks', 'タスク管理')
    .addTag('integration', '外部連携')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap();
