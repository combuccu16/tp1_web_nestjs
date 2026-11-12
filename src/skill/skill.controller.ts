import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { SkillEntity } from './entities/skill.entity.js';
import { SkillService } from './skill.service.js';
@Controller('skills')
export class SkillController {
    constructor(private readonly skillService: SkillService) { }
    @Post()
    create(@Body() dto: CreateSkillDto): Promise<SkillEntity> {
        return this.skillService.create(dto);
    }
    @Get()
    findAll(): Promise<SkillEntity[]> {
        return this.skillService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<SkillEntity> {
        return this.skillService.findOne(id);
    }
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSkillDto): Promise<SkillEntity> {
        return this.skillService.update(id, dto);
    }
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<SkillEntity> {
        return this.skillService.remove(id);
    }
}
