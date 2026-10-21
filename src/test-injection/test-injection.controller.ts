import { Controller, Get } from '@nestjs/common';
import { TestInjectionService } from './test-injection.service.js';
@Controller('test-injection')
export class TestInjectionController {
    constructor(private readonly testInjectionService: TestInjectionService) { }
    @Get('uuid')
    getUuid(): {
        id: string;
    } {
        return { id: this.testInjectionService.generateId() };
    }
}
