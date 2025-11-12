// src/users/users.service.ts
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const user = { ...userData, id: this.idCounter++ };
    this.users.push(user);
    return user;
  }
}
