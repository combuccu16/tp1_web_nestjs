import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UserEntity } from '../user/entities/user.entity.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';

@Module({
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'development-secret',
            signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as `${number}${'s' | 'm' | 'h' | 'd'}` },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
    exports: [JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {
}
