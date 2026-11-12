import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserEntity } from '../user/entities/user.entity.js';
import { CvService } from './cv.service.js';
import { CreateCvDto } from './dto/create-cv.dto.js';
import { UpdateCvDto } from './dto/update-cv.dto.js';
import { CvEntity } from './entities/cv.entity.js';
@Controller('cvs')
@UseGuards(JwtAuthGuard)
export class CvController {
    constructor(private readonly cvService: CvService) { }
    @Post()
    create(@Body() dto: CreateCvDto, @CurrentUser() user: UserEntity): Promise<CvEntity> {
        return this.cvService.createFor(dto, user);
    }
    @Get()
    findAll(@CurrentUser() user: UserEntity): Promise<CvEntity[]> {
        return this.cvService.findAllFor(user);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: UserEntity): Promise<CvEntity> {
        return this.cvService.findOneFor(id, user);
    }
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCvDto, @CurrentUser() user: UserEntity): Promise<CvEntity> {
        return this.cvService.updateFor(id, dto, user);
    }
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: UserEntity): Promise<CvEntity> {
        return this.cvService.removeFor(id, user);
    }
}
