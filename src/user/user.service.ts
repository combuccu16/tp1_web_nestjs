import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/generic/crud.service.js';
import { UserEntity } from './entities/user.entity.js';

/**
 * Service des users.
 *
 * Le CRUD (create / findAll / findOne → 404 / update / remove) est hérité de
 * `CrudService<UserEntity>` : on ne réécrit rien, on injecte seulement le
 * repository de l'entité.
 */
@Injectable()
export class UserService extends CrudService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        repository: Repository<UserEntity>,
    ) {
        super(repository);
    }
}
