import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CvEntity } from './cv.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { SkillEntity } from '../../skill/entities/skill.entity.js';
import { RoleEnum } from '../../user/enums/role.enum.js';

describe('CV entities relations (B5) and schema guarantees (B2, B6)', () => {
	let dataSource: DataSource;

	beforeEach(async () => {
		dataSource = new DataSource({
			type: 'better-sqlite3',
			database: ':memory:',
			entities: [UserEntity, CvEntity, SkillEntity],
			synchronize: true,
		});
		await dataSource.initialize();
	});

	afterEach(async () => {
		if (dataSource.isInitialized) await dataSource.destroy();
	});

	it('creates the tables and the cvs_skills join table with FKs', () => {
		const tableNames = dataSource.entityMetadatas.map((m) => m.tableName);
		expect(tableNames).toEqual(
			expect.arrayContaining(['users', 'cvs', 'skills']),
		);

		const joinTable = dataSource
			.getMetadata(CvEntity)
			.ownRelations.find((relation) => relation.joinTableName);
		expect(joinTable?.joinTableName).toBe('cvs_skills');
		expect(joinTable?.foreignKeys).toHaveLength(2);
	});

	it('saves and loads a CV through both sides of each relation', async () => {
		const users = dataSource.getRepository(UserEntity);
		const skills = dataSource.getRepository(SkillEntity);
		const cvs = dataSource.getRepository(CvEntity);

		const user = await users.save(
			users.create({
				username: 'muhyi',
				email: 'muhyi@mail.io',
				password: 'secret',
			}),
		);
		const skill = await skills.save(
			skills.create({ designation: 'TypeScript' }),
		);
		await cvs.save(
			cvs.create({
				lastname: 'Ben Fraj',
				firstname: 'Muhyiddin',
				age: 21,
				cin: '12345678',
				job: 'Dev',
				path: '/cvs/1.pdf',
				user,
				skills: [skill],
			}),
		);

		const cv = await cvs.findOneOrFail({
			where: { id: 1 },
			relations: { user: true, skills: true },
		});
		expect(cv.user?.username).toBe('muhyi');
		expect(cv.skills.map((s) => s.designation)).toEqual(['TypeScript']);

		const userWithCvs = await users.findOneOrFail({
			where: { id: user.id },
			relations: { cvs: true },
		});
		expect(userWithCvs.cvs).toHaveLength(1);

		const skillWithCvs = await skills.findOneOrFail({
			where: { id: skill.id },
			relations: { cvs: true },
		});
		expect(skillWithCvs.cvs).toHaveLength(1);
	});

	it('hides password by default (select: false)', async () => {
		const users = dataSource.getRepository(UserEntity);
		await users.save(
			users.create({
				username: 'muhyi',
				email: 'muhyi@mail.io',
				password: 'secret',
			}),
		);

		const found = await users.findOneByOrFail({ username: 'muhyi' });
		expect(found.password).toBeUndefined();
		const explicit = await users.findOneOrFail({
			where: { username: 'muhyi' },
			select: { password: true },
		});
		expect(explicit.password).toBe('secret');
	});

	it('rejects duplicate username and email (unique: true)', async () => {
		const users = dataSource.getRepository(UserEntity);
		const user = {
			username: 'muhyi',
			email: 'muhyi@mail.io',
			password: 'secret',
		};
		await users.save(users.create(user));

		await expect(users.save(users.create({ ...user }))).rejects.toThrow(
			/UNIQUE constraint failed/,
		);
		await expect(
			users.save(users.create({ ...user, username: 'other' })),
		).rejects.toThrow(/UNIQUE constraint failed/);
	});

	it('defaults role to USER and accepts the enum values', async () => {
		const users = dataSource.getRepository(UserEntity);
		const user = await users.save(
			users.create({
				username: 'muhyi',
				email: 'muhyi@mail.io',
				password: 'secret',
			}),
		);
		expect(user.role).toBe(RoleEnum.USER);

		const admin = await users.save(
			users.create({
				username: 'admin',
				email: 'admin@mail.io',
				password: 'secret',
				role: RoleEnum.ADMIN,
			}),
		);
		expect(admin.role).toBe(RoleEnum.ADMIN);
	});

	it('hard-deleting a user cascades to their CVs (onDelete: CASCADE)', async () => {
		const users = dataSource.getRepository(UserEntity);
		const cvs = dataSource.getRepository(CvEntity);

		const user = await users.save(
			users.create({
				username: 'muhyi',
				email: 'muhyi@mail.io',
				password: 'secret',
			}),
		);
		await cvs.save(
			cvs.create({
				lastname: 'Ben Fraj',
				firstname: 'Muhyiddin',
				age: 21,
				cin: '12345678',
				job: 'Dev',
				path: '/cvs/1.pdf',
				user,
			}),
		);

		await users.delete(user.id);
		expect(await cvs.count()).toBe(0);
	});

	it('lets a CV exist without an owner (nullable userId)', async () => {
		const cvs = dataSource.getRepository(CvEntity);
		const cv = await cvs.save(
			cvs.create({
				lastname: 'Sans',
				firstname: 'Proprio',
				age: 30,
				cin: '87654321',
				job: 'Dev',
				path: '/cvs/2.pdf',
			}),
		);
		expect(cv.userId).toBeNull();
		expect(await cvs.count()).toBe(1);
	});
});
