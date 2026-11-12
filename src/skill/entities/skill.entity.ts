import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';
import { CvEntity } from '../../cv/entities/cv.entity.js';

@Entity('skills')
export class SkillEntity extends TimestampEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	designation: string;

	// Inverse side: the join table is owned by CvEntity.
	@ManyToMany(() => CvEntity, (cv) => cv.skills)
	cvs: CvEntity[];
}
