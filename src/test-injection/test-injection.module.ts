import { Module } from '@nestjs/common';
import { TestInjectionController } from './test-injection.controller.js';
import { TestInjectionService } from './test-injection.service.js';
@Module({
    controllers: [TestInjectionController],
    providers: [TestInjectionService],
})
export class TestInjectionModule {
}
