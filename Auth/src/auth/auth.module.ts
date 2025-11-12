// src/auth/auth.module.ts
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersService } from '../users/users.service.js';

export class AuthModule {
  public authService: AuthService;
  public authController: AuthController;

  constructor() {
    const usersService = new UsersService();
    this.authService = new AuthService(usersService);
    this.authController = new AuthController(this.authService);
  }
}
