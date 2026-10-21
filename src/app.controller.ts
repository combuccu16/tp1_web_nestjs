import { Controller, Get } from '@nestjs/common';
import type { ApiIndex } from './app.service.js';
import { AppService } from './app.service.js';
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }
    @Get()
    getIndex(): ApiIndex {
        return this.appService.getIndex();
    }
}
