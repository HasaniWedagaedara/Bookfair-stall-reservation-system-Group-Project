import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param registerDto - User registration data
   * @returns User object and JWT token
   */
  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        businessName: registerDto.businessName,
        phone: registerDto.phone,
        role: registerDto.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = this.createToken(user.id, user.email);

    return {
      message: 'User registered successfully',
      user,
      token,
    };
  }

  /**
   * Login user
   * @param loginDto - User login credentials
   * @returns User object and JWT token
   */
  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.createToken(user.id, user.email);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        businessName: user.businessName,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Get current authenticated user
   * @param userId - User ID from JWT token
   * @returns User object
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Create JWT token
   * @param id - User ID
   * @param email - User email
   * @returns JWT token string
   */
  private createToken(id: string, email: string): string {
    const payload = { id, email };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }
}