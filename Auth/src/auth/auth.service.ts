import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service.js';

class AuthService {
  private usersService: UsersService;
  
  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  async register(userData: { name: string; email: string; password: string; role: string }) {
    const existing = await this.usersService.findByEmail(userData.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({ 
      ...userData, 
      password: hashedPassword 
    });

    const { password, ...userWithoutPassword } = user;
    
    return { 
      message: 'User registered successfully', 
      user: userWithoutPassword 
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    return { 
      token, 
      user: userWithoutPassword 
    };
  }
}

export { AuthService };