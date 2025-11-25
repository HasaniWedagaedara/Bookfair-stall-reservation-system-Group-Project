import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

 
   // Create a genre (Admin only)

  async createGenre(name: string, description?: string) {
    const existingGenre = await this.prisma.genre.findUnique({
      where: { name: name },
    });

    if (existingGenre) {
      throw new ConflictException(`Genre '${name}' already exists`);
    }

    const genre = await this.prisma.genre.create({
      data: {
        id: randomUUID(),
        name: name,
        description: description,
      },
    });

    return genre;
  }

 
   // Get all genres (Public)
 
  async getAllGenres() {
    const genres = await this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      count: genres.length,
      genres,
    };
  }

  
   //Get single genre by ID (Public)
   
  async getGenreById(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

 
//Update genre (Admin only)
   
  async updateGenre(id: string, name?: string, description?: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    if (name && name !== genre.name) {
      const existingGenre = await this.prisma.genre.findUnique({
        where: { name },
      });

      if (existingGenre) {
        throw new ConflictException(`Genre '${name}' already exists`);
      }
    }

    // Build update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const updatedGenre = await this.prisma.genre.update({
      where: { id },
      data: updateData,
    });

    return updatedGenre;
  }


   // Delete genre (Admin only)
  
  async deleteGenre(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    // Delete genre - delete related ReservationGenre records 
    await this.prisma.genre.delete({
      where: { id },
    });

    return { message: 'Genre deleted successfully' };
  }
}