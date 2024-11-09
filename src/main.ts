import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigModule } from './common/swagger/swagger.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //เรียกใช้ module swagger มี่สร้างขึ้น เพื่อให้ api-docs ใช้งานง่าย และกลับมาอ่านแล้วทำความเข้าใจได้ง่าย
  SwaggerConfigModule.setupSwagger(app);

  //ใช้ ValidationPipe เพื่อป้องการ SQL Injection 
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // เปลี่ยนข้อมูลเป็นประเภทที่กำหนดใน 
    whitelist: true,  // กรองออกฟิลด์ที่ไม่ได้ระบุใน DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
  const logger = new Logger('Bootstrap'); //เพิ่ม logger เอาไว้สำำหรับ log
  logger.log('Application started successfully');
}
bootstrap();
