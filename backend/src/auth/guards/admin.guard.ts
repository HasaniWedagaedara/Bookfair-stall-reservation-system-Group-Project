import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface RequestWithUser {
  user?: {
    id: string;
    email: string;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Not authenticated');
    }

    // Check if user is admin
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (dbUser?.role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
