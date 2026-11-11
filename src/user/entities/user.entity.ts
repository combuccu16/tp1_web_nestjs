import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';

@Entity('users')
export class UserEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;
}
