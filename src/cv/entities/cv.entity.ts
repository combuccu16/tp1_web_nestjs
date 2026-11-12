import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { SkillEntity } from '../../skill/entities/skill.entity.js';

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

	// Nullable until auth merges: phase 1 creates CVs with no logged-in user.
	// CASCADE: a CV has no meaning without its owner (fires on hard DELETE only).
	@Column({ type: 'integer', nullable: true })
	userId?: number | null;

	@ManyToOne(() => UserEntity, (user) => user.cvs, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	user?: UserEntity | null;

	// Owner side: the join table lives here (explicit name: default would be
	// cvs_skills_skills). No cascade on save: skills are the Skill module's
	// rows; CvService resolves skillIds explicitly.
	@ManyToMany(() => SkillEntity, (skill) => skill.cvs)
	@JoinTable({ name: 'cvs_skills' })
	skills: SkillEntity[];
}
