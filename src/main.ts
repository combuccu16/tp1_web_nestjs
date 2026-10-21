import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { setupStaticAssets } from './common/static-assets.js';
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    setupStaticAssets(app);
    await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
