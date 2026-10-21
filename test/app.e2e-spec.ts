import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer()).get('/').expect(200);

		// L'index remplace le message d'accueil du scaffold `nest new`.
		expect(response.body.name).toBe('TP1 RT4 — Todo API');
		expect(response.body.status).toBe('ok');
		expect(response.body.endpoints).toEqual(
			expect.arrayContaining([expect.objectContaining({ method: 'GET', path: '/todos' })]),
		);
	});

	afterEach(async () => {
		await app.close();
	});
});
