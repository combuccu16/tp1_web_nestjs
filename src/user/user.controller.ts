import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserEntity } from './entities/user.entity.js';
import { UserService } from './user.service.js';
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post()
    create(@Body() dto: CreateUserDto): Promise<UserEntity> {
        return this.userService.create(dto);
    }
    @Get()
    findAll(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.userService.findOne(id);
    }
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<UserEntity> {
        return this.userService.update(id, dto);
    }
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.userService.remove(id);
    }
}
