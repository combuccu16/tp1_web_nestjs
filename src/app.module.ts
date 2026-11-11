import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CommonModule } from './common/common.module.js';
import { TestInjectionModule } from './test-injection/test-injection.module.js';
import { dataSourceOptions } from './data-source.js';
import { TodoModule } from './todo/todo.module.js';
import { UserModule } from './user/user.module.js';
import { CvModule } from './cv/cv.module.js';
import { SkillModule } from './skill/skill.module.js';
import { AuthModule } from './auth/auth.module.js';
@Module({
    imports: [
        CommonModule,
        TestInjectionModule,
        TypeOrmModule.forRoot(dataSourceOptions),
        TodoModule,
        UserModule,
        CvModule,
        SkillModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
