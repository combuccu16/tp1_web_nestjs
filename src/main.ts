import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { setupStaticAssets } from './common/static-assets.js';

async function bootstrap() {
	// `NestExpressApplication` expose `useStaticAssets`, que l'interface
	// `INestApplication` ne propose pas : c'est lui qui permet de servir
	// le frontend statique depuis l'API elle-même.
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	// Validation globale de tous les DTOs de l'application :
	// - whitelist  : les champs inconnus des DTO sont supprimés de la payload ;
	// - transform  : transforme la payload brute en instance du DTO.
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);
	// Frontend statique (dossier `public/`) servi sur `/ui`.
	setupStaticAssets(app);
	await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
