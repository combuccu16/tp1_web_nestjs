import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';
import { RoleEnum } from '../enums/role.enum.js';
import { CvEntity } from '../../cv/entities/cv.entity.js';

@Entity('users')
export class UserEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Exclude({ toPlainOnly: true })
    @Column({ select: false })
    password: string;

    // SQLite has no native ENUM type; TypeORM stores simple-enum values as text.
    @Column({ type: 'simple-enum', enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum;

    @OneToMany(() => CvEntity, (cv) => cv.owner)
    cvs: CvEntity[];
}
