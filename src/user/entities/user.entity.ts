import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';
import { RoleEnum } from '../enums/role.enum.js';

@Entity('users')
export class UserEntity extends TimestampEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', unique: true })
	username: string;

	@Column({ type: 'varchar', unique: true })
	email: string;

	// Hash only: never returned by find(); login selects it explicitly to compare.
	@Column({ type: 'varchar', select: false })
	password: string;

	@Column({ type: 'simple-enum', enum: RoleEnum, default: RoleEnum.USER })
	role: RoleEnum;
}
