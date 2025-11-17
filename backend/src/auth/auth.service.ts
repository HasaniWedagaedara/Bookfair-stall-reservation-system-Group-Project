import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register new user
  async register(
    email: string,
    password: string,
    name: string,
    businessName: string,
    mobileNumber: string,
  ) {
    //console.log('Business Name:', businessName);
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        name,
        password: hashedPassword,
        role: 'user',
        businessName,
        mobileNumber,
      },
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    // Create JWT token
    const token = this.createToken(user.email, user.id);

    return { user: userWithoutPassword, token };
  }

  // User login
  async userLogin(email: string, password: string, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is trying to login as admin
    if (user.role === 'admin') {
      throw new ForbiddenException('Please use admin login page');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Create token
    const token = this.createToken(user.email, user.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    // Set cookie and return user
    return res
      .status(200)
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
      .json(userWithoutPassword);
  }

  // Admin login
  async adminLogin(email: string, password: string, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied. Admin credentials required');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Create token
    const token = this.createToken(user.email, user.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    // Set cookie and return user
    return res
      .status(200)
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      })
      .json(userWithoutPassword);
  }

  // Get current user
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        picture: true,
        businessName: true,
        mobileNumber: true,
        createdAt: true,
        updatedAt: true,
        // password excluded
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  // Logout
  // eslint-disable-next-line @typescript-eslint/require-await
  async logout(res: Response) {
    return res
      .clearCookie('jwt')
      .status(200)
      .json({ message: 'Successfully logged out' });
  }

  // Helper: Create JWT token
  private createToken(email: string, id: string): string {
    const payload = { email, id };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): { id: string; email: string } {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.jwtService.verify(token);
      return decoded as { id: string; email: string };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
