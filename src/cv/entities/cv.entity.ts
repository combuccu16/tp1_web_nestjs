import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';

@Entity('cvs')
export class CvEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;
}
