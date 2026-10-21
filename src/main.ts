import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// Validation globale de tous les DTOs de l'application :
	// - whitelist  : les champs inconnus des DTO sont supprimés de la payload ;
	// - transform  : transforme la payload brute en instance du DTO.
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);
	await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
