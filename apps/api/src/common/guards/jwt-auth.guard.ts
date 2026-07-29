import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('يرجى تقديم التوكن في الترويسة Authorization');
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = process.env.JWT_SECRET || 'masar_super_secret_jwt_key_2026';
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('التوكن غير صالحة أو منتهية الصلاحية');
    }
  }
}
