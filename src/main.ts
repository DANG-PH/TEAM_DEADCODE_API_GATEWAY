import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật Helmet bảo mật header HTTP
  app.use(helmet());

  // Bật CORS cho phép frontend gọi API
  app.enableCors({
    origin: '*',
    credentials: false,
  });

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('THUY LINH')
    .setDescription('Tài liệu tổng hợp API của API Gateway')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


  // Bật validation cho tất cả request body/query/params
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // loại bỏ các field không có trong DTO
    forbidNonWhitelisted: true, // báo lỗi nếu gửi field lạ
    transform: true, // tự chuyển kiểu dữ liệu nếu cần
  }));

  await app.listen(Number(process.env.PORT));
  console.log(`Server đang chạy tại: http://localhost:${process.env.PORT}`);
  console.log(`Swagger tại: http://localhost:${process.env.PORT}/api-docs`);
}
bootstrap();

