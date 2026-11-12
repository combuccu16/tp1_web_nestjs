import { NestFactory } from '@nestjs/core';
import { randEmail, randFirstName, randJobTitle, randLastName, randNumber, randSkill, } from '@ngneat/falso';
import bcrypt from 'bcryptjs';
import { DataSource, type EntityManager } from 'typeorm';
import { AppModule } from '../app.module.js';
import { UUID } from '../common/uuid/token.js';
import { CvEntity } from '../cv/entities/cv.entity.js';
import { SkillEntity } from '../skill/entities/skill.entity.js';
import { UserEntity } from '../user/entities/user.entity.js';
import { RoleEnum } from '../user/enums/role.enum.js';

const SEED_PASSWORD = 'password123';
const USER_COUNT = 5;
const SKILL_COUNT = 12;
const CVS_PER_USER = { min: 1, max: 3 };
const SKILLS_PER_CV = { min: 1, max: 4 };

function pickRandom<T>(items: T[], count: number): T[] {
    return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

async function seedSkills(manager: EntityManager): Promise<SkillEntity[]> {
    const designations = new Set<string>();
    while (designations.size < SKILL_COUNT) {
        designations.add(randSkill());
    }
    return manager.save(SkillEntity, [...designations].map((designation) => manager.create(SkillEntity, { designation })));
}

async function seedUsers(manager: EntityManager, passwordHash: string): Promise<UserEntity[]> {
    const users = [
        manager.create(UserEntity, {
            username: 'admin',
            email: 'admin@cv.tn',
            password: passwordHash,
            role: RoleEnum.ADMIN,
        }),
    ];
    for (let i = 1; i <= USER_COUNT; i++) {
        const firstName = randFirstName({ withAccents: false });
        users.push(manager.create(UserEntity, {
            username: `user${i}`,
            email: randEmail({ firstName, lastName: `user${i}` }),
            password: passwordHash,
            role: RoleEnum.USER,
        }));
    }
    return manager.save(UserEntity, users);
}

async function seedCvs(manager: EntityManager, users: UserEntity[], skills: SkillEntity[], uuid: () => string): Promise<CvEntity[]> {
    const cvs: CvEntity[] = [];
    for (const user of users) {
        const count = randNumber(CVS_PER_USER);
        for (let i = 0; i < count; i++) {
            cvs.push(manager.create(CvEntity, {
                lastname: randLastName({ withAccents: false }),
                firstname: randFirstName({ withAccents: false }),
                age: randNumber({ min: 20, max: 60 }),
                cin: String(randNumber({ min: 10_000_000, max: 99_999_999 })),
                job: randJobTitle(),
                path: `uploads/cvs/${uuid()}.pdf`,
                user,
                skills: pickRandom(skills, randNumber(SKILLS_PER_CV)),
            }));
        }
    }
    return manager.save(CvEntity, cvs);
}

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const dataSource = app.get(DataSource);
        const uuid = app.get<() => string>(UUID);

        if (await dataSource.getRepository(UserEntity).count() > 0) {
            console.log('Users already exist; seed skipped.');
            return;
        }

        const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
        await dataSource.transaction(async (manager) => {
            const skills = await seedSkills(manager);
            const users = await seedUsers(manager, passwordHash);
            const cvs = await seedCvs(manager, users, skills, uuid);
            console.log(`Seeded ${skills.length} skills, ${users.length} users, ${cvs.length} CVs.`);
        });
        console.log(`Logins: admin (ADMIN), user1..user${USER_COUNT} (USER) - password: ${SEED_PASSWORD}`);
    }
    finally {
        await app.close();
    }
}
await bootstrap();
