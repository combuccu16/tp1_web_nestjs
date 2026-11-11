import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/generic/crud.service.js';
import { SkillEntity } from './entities/skill.entity.js';
@Injectable()
export class SkillService extends CrudService<SkillEntity> {
    constructor(@InjectRepository(SkillEntity) repository: Repository<SkillEntity>) {
        super(repository);
    }
}
