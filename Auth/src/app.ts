import express from 'express';
import dotenv from 'dotenv';
import { AuthService } from './auth/auth.service.js';
import { UsersService } from './users/users.service.js';
import { jwtGuard } from './utils/jwt.guard.js';

dotenv.config();

const app = express();
app.use(express.json());

const usersService = new UsersService();
const authService = new AuthService(usersService);

// Auth routes
app.post('/auth/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Protected test route
app.get('/protected', jwtGuard, (req, res) => {
  res.json({ message: 'You are authorized', user: (req as any).user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
