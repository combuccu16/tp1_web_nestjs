import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CommonModule } from './common/common.module.js';
import { TestInjectionModule } from './test-injection/test-injection.module.js';

@Module({
  imports: [CommonModule, TestInjectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
