import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors({
        origin: ['http://localhost:5173'],
        credentials: true,
        exposedHeaders: 'set-cookie',
    });

    const config = new DocumentBuilder()
        .setTitle('Nu1 api')
        .setDescription('This api for Nu1 social app')
        .setVersion('1.0')
        .addTag('API')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);

    await app.listen(4200);
}
bootstrap();
