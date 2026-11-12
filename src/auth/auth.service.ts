import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { UserEntity } from '../user/entities/user.entity.js';
import { RoleEnum } from '../user/enums/role.enum.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.users.findOne({
            where: [{ username: dto.username }, { email: dto.email }],
        });
        if (existing) {
            throw new ConflictException('Username or email is already in use');
        }

        const user = this.users.create({
            username: dto.username,
            email: dto.email,
            password: await hash(dto.password, 12),
            role: RoleEnum.USER,
        });
        const saved = await this.users.save(user);
        return this.publicUser(saved);
    }

    async login(dto: LoginDto) {
        const user = await this.users
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.username = :identifier OR user.email = :identifier', { identifier: dto.identifier })
            .getOne();

        if (!user || !(await compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username, role: user.role };
        return { access_token: await this.jwtService.signAsync(payload), user: this.publicUser(user) };
    }

    async findById(id: number) {
        return this.users.findOne({ where: { id } });
    }

    private publicUser(user: UserEntity) {
        return { id: user.id, username: user.username, email: user.email, role: user.role };
    }
}
