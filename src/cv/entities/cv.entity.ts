import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';

@Entity('cvs')
export class CvEntity extends TimestampEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	lastname: string;

	@Column({ type: 'varchar' })
	firstname: string;

	@Column({ type: 'integer' })
	age: number;

	@Column({ type: 'varchar' })
	cin: string;

	@Column({ type: 'varchar' })
	job: string;

	@Column({ type: 'varchar' })
	path: string;
}
