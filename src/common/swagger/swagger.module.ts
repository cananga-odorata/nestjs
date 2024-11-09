import { Module } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Module({})
export class SwaggerConfigModule {
    static setupSwagger(app) {
        const options = new DocumentBuilder()
            .setTitle('Assignment API Document')
            .setDescription('API Assignment')
            .setVersion('1.0')
            .addTag('Products', 'กลุ่ม API สำหรับจัดการเกี่ยวกับผลิตภัณฑ์')
            .addBearerAuth(
                {
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    type: 'http',
                    in: 'Header',
                },
                'access-token',
            )
            .addApiKey(
                {
                    type: 'apiKey',
                    name: 'ApiToken',
                    in: 'header',
                },
                'api-key',
            )
            .build();

        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);
    }
}
