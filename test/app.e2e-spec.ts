import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { setupStaticAssets } from './../src/common/static-assets.js';
describe('AppController (e2e)', () => {
    let app: INestApplication<App>;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        setupStaticAssets(app as NestExpressApplication);
        await app.init();
    });
    it('/ (GET)', async () => {
        const response = await request(app.getHttpServer()).get('/').expect(200);
        expect(response.body.name).toBe('TP1 RT4 — Todo API');
        expect(response.body.status).toBe('ok');
        expect(response.body.endpoints).toEqual(expect.arrayContaining([expect.objectContaining({ method: 'GET', path: '/todos' })]));
    });
    it('/ui/ (GET) serves the static frontend', async () => {
        const response = await request(app.getHttpServer()).get('/ui/').expect(200);
        expect(response.headers['content-type']).toContain('text/html');
        expect(response.text).toContain('<title>Todo board');
    });
    it('/ui/styles.css (GET) serves the stylesheet', async () => {
        const response = await request(app.getHttpServer()).get('/ui/styles.css').expect(200);
        expect(response.headers['content-type']).toContain('text/css');
    });
    afterEach(async () => {
        await app.close();
    });
});
