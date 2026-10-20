import { Module } from '@nestjs/common';
import { TestInjectionController } from './test-injection.controller.js';
import { TestInjectionService } from './test-injection.service.js';

/**
 * Demo module: verifies that the uuid provider exported by the
 * (global) CommonModule resolves correctly via dependency injection.
 */
@Module({
  controllers: [TestInjectionController],
  providers: [TestInjectionService],
})
export class TestInjectionModule {}
