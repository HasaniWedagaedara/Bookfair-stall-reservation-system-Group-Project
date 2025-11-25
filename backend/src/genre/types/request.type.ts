import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export interface CreateGenreRequest {
  name: string;
  description?: string;
}

export interface UpdateGenreRequest {
  name?: string;
  description?: string;
}