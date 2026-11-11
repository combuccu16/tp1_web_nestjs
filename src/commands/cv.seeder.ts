import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        console.log('Seeder ready: waiting for the User / Cv / Skill entities (Ben Fraj).');
    }
    finally {
        await app.close();
    }
}
await bootstrap();
