import { NotFoundException } from '@nestjs/common';
import type { DeepPartial, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export interface HasId {
    id: number;
}

export abstract class CrudService<T extends ObjectLiteral & HasId> {
    protected constructor(protected readonly repository: Repository<T>) { }

    create(dto: DeepPartial<T>): Promise<T> {
        return this.repository.save(this.repository.create(dto));
    }

    findAll(): Promise<T[]> {
        return this.repository.find();
    }

    async findOne(id: number): Promise<T> {
        const entity = await this.repository.findOneBy({ id } as FindOptionsWhere<T>);
        if (!entity) {
            throw new NotFoundException(`${this.repository.metadata.name} #${id} not found`);
        }
        return entity;
    }

    async update(id: number, dto: DeepPartial<T>): Promise<T> {
        const entity = await this.repository.preload({ ...dto, id } as DeepPartial<T>);
        if (!entity) {
            throw new NotFoundException(`${this.repository.metadata.name} #${id} not found`);
        }
        return this.repository.save(entity);
    }

    async remove(id: number): Promise<T> {
        const entity = await this.findOne(id);
        return this.repository.softRemove(entity);
    }
}
