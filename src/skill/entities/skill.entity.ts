import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';

@Entity('skills')
export class SkillEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;
}
