import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import type { DeepPartial } from 'typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/generic/crud.service.js';
import { UserEntity } from './entities/user.entity.js';
const PASSWORD_SALT_ROUNDS = 12;
@Injectable()
export class UserService extends CrudService<UserEntity> {
    constructor(@InjectRepository(UserEntity) repository: Repository<UserEntity>) {
        super(repository);
    }
    override async create(dto: DeepPartial<UserEntity>): Promise<UserEntity> {
        const saved = await super.create(await this.withHashedPassword(dto));
        return this.findOne(saved.id);
    }
    override async update(id: number, dto: DeepPartial<UserEntity>): Promise<UserEntity> {
        await super.update(id, await this.withHashedPassword(dto));
        return this.findOne(id);
    }
    private async withHashedPassword(dto: DeepPartial<UserEntity>): Promise<DeepPartial<UserEntity>> {
        if (typeof dto.password !== 'string') {
            return dto;
        }
        return { ...dto, password: await hash(dto.password, PASSWORD_SALT_ROUNDS) };
    }
}
