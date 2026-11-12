import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { RoleEnum } from './enums/role.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserEntity } from './entities/user.entity.js';
import { UserService } from './user.service.js';
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
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
