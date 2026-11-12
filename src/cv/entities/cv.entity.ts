import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';

@Entity('cvs')
export class CvEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.cvs, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'ownerId' })
    owner: UserEntity | null;
}
