import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/generic/crud.service.js';
import { SkillEntity } from './entities/skill.entity.js';

/**
 * Service des skills.
 *
 * Le CRUD (create / findAll / findOne → 404 / update / remove) est hérité de
 * `CrudService<SkillEntity>` : on ne réécrit rien, on injecte seulement le
 * repository de l'entité.
 */
@Injectable()
export class SkillService extends CrudService<SkillEntity> {
    constructor(
        @InjectRepository(SkillEntity)
        repository: Repository<SkillEntity>,
    ) {
        super(repository);
    }
}
