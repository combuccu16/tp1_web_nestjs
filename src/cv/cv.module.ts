import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvEntity } from './entities/cv.entity.js';
import { CvController } from './cv.controller.js';
import { CvService } from './cv.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([CvEntity])],
    controllers: [CvController],
    providers: [CvService],
    exports: [CvService],
})
export class CvModule {
}
