import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

interface RequestWithCookies {
  headers: {
    cookie?: string;
  };
  user?: {
    id: string;
    email: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();

    // Get JWT from cookie
    if (!request.headers.cookie) {
      throw new UnauthorizedException('No authentication token found');
    }

    const cookies = request.headers.cookie.split('; ');
    const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));

    if (!jwtCookie) {
      throw new UnauthorizedException('No authentication token found');
    }

    const token = jwtCookie.split('=')[1];

    try {
      const user = this.authService.verifyToken(token);
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
