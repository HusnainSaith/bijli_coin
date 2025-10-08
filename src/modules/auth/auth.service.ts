import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';

import { RolesService } from '../roles/roles.service'; // ✅ add import

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService, // ✅ inject here
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Allow any role value, don't restrict to enum

    // ✅ check if role_id exists in DB (assuming you have a Role entity/table)
    if (dto.role_id) {
      const roleExists = await this.rolesService.findById(dto.role_id);
      if (!roleExists) {
        throw new BadRequestException(`Invalid role_id: ${dto.role_id}`);
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userPayload: any = {
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || 'user',
      status: dto.status,
    };

    const user = await this.usersService.create(userPayload);

    const { password, ...result } = user;
    return {
      success: true,
      message: 'User registered successfully',
      user: result,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.id, email: user.email, role_id: user.role_id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = await this.generateRefreshToken(user.id);

    const { password, ...userResult } = user;
    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken: refreshToken.token,
        user: userResult,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    // Validate refreshToken to prevent NoSQL injection
    if (
      typeof dto.refreshToken !== 'string' ||
      !/^[A-Za-z0-9\-\._~\+\/]+=*$/.test(dto.refreshToken)
    ) {
      throw new UnauthorizedException('Invalid refresh token format');
    }
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: dto.refreshToken, is_revoked: false },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload = {
      sub: refreshToken.user.id,
      email: refreshToken.user.email,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken },
    };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepository.update(
      { token: refreshToken },
      { is_revoked: true },
    );

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    return {
      success: true,
      message: 'Password reset token generated',
      token: resetToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(dto.token);
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token type');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      await this.usersService.updatePassword(payload.sub, hashedPassword);

      await this.refreshTokenRepository.update(
        { user_id: payload.sub },
        { is_revoked: true },
      );

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async generateRefreshToken(userId: string): Promise<RefreshToken> {
    const token = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user_id: userId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return this.refreshTokenRepository.save(refreshToken);
  }
}
