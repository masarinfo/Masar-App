import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@masar/db';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { IAuthResponse, IUser } from '@masar/types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private sanitizeUser(user: any): IUser {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const secret = process.env.JWT_SECRET || 'masar_super_secret_jwt_key_2026';

    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto): Promise<IAuthResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('البريد الإلكتروني مُسجل بالفعل');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
        language: 'ar',
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto): Promise<IAuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const secret = process.env.JWT_SECRET || 'masar_super_secret_jwt_key_2026';
      const payload = await this.jwtService.verifyAsync(refreshToken, { secret });

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('المستخدم غير موجود');
      }

      const newSecret = process.env.JWT_SECRET || 'masar_super_secret_jwt_key_2026';
      const accessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        { secret: newSecret, expiresIn: '15m' },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('التوكن التنشيطية غير صالحة');
    }
  }

  async validateUser(userId: string): Promise<IUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('لم يتم العثور على المستخدم');
    }

    return this.sanitizeUser(user);
  }
}
