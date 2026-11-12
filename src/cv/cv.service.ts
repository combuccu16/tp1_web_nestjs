import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CrudService } from '../common/generic/crud.service.js';
import { SkillEntity } from '../skill/entities/skill.entity.js';
import { UserEntity } from '../user/entities/user.entity.js';
import { RoleEnum } from '../user/enums/role.enum.js';
import { CreateCvDto } from './dto/create-cv.dto.js';
import { UpdateCvDto } from './dto/update-cv.dto.js';
import { CvEntity } from './entities/cv.entity.js';
@Injectable()
export class CvService extends CrudService<CvEntity> {
    constructor(
    @InjectRepository(CvEntity)
    repository: Repository<CvEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>) {
        super(repository);
    }
    async createFor(dto: CreateCvDto, user: UserEntity): Promise<CvEntity> {
        const { skillIds, ...data } = dto;
        const cv = this.repository.create({
            ...data,
            path: data.path ?? '',
            user,
            skills: await this.resolveSkills(skillIds),
        });
        return this.repository.save(cv);
    }
    findAllFor(user: UserEntity): Promise<CvEntity[]> {
        return this.repository.find({
            where: this.isAdmin(user) ? {} : { userId: user.id },
            relations: { skills: true, user: true },
            order: { id: 'ASC' },
        });
    }
    async findOneFor(id: number, user: UserEntity): Promise<CvEntity> {
        const cv = await this.findWithRelations(id);
        if (!this.isAdmin(user) && cv.userId !== user.id) {
            throw new ForbiddenException(`You are not allowed to access CV #${id}`);
        }
        return cv;
    }
    async updateFor(id: number, dto: UpdateCvDto, user: UserEntity): Promise<CvEntity> {
        const cv = await this.findOwned(id, user);
        const { skillIds, ...data } = dto;
        Object.assign(cv, data);
        if (skillIds !== undefined) {
            cv.skills = await this.resolveSkills(skillIds);
        }
        return this.repository.save(cv);
    }
    async removeFor(id: number, user: UserEntity): Promise<CvEntity> {
        const cv = await this.findOwned(id, user);
        return this.repository.softRemove(cv);
    }
    private isAdmin(user: UserEntity): boolean {
        return user.role === RoleEnum.ADMIN;
    }
    private async findWithRelations(id: number): Promise<CvEntity> {
        const cv = await this.repository.findOne({
            where: { id },
            relations: { skills: true, user: true },
        });
        if (!cv) {
            throw new NotFoundException(`CvEntity #${id} not found`);
        }
        return cv;
    }
    private async findOwned(id: number, user: UserEntity): Promise<CvEntity> {
        const cv = await this.findWithRelations(id);
        if (cv.userId !== user.id) {
            throw new ForbiddenException(`You can only modify or delete your own CVs (CV #${id})`);
        }
        return cv;
    }
    private async resolveSkills(skillIds?: number[]): Promise<SkillEntity[]> {
        if (!skillIds?.length) {
            return [];
        }
        const uniqueIds = [...new Set(skillIds)];
        const skills = await this.skillRepository.findBy({ id: In(uniqueIds) });
        if (skills.length !== uniqueIds.length) {
            const found = new Set(skills.map((skill) => skill.id));
            const missing = uniqueIds.filter((id) => !found.has(id));
            throw new NotFoundException(`Unknown skill id(s): ${missing.join(', ')}`);
        }
        return skills;
    }
}
