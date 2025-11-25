import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guard/admin.guard';
import * as requestType from './types/request.type';

@Controller('genres')
export class GenreController {
  constructor(private genreService: GenreService) {}

 
   //Create genre (Admin only)
  
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @HttpCode(201)
  async createGenre(@Body() body: requestType.CreateGenreRequest) {
    return await this.genreService.createGenre(body.name, body.description);
  }

  
   //Get all genres (Public)
  
  @Get()
  async getAllGenres() {
    return await this.genreService.getAllGenres();
  }


   // Get genre by ID (Public)
   
  @Get(':id')
  async getGenreById(@Param('id') id: string) {
    return await this.genreService.getGenreById(id);
  }

   //Update genre (Admin only)
 
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateGenre(
    @Param('id') id: string,
    @Body() body: requestType.UpdateGenreRequest,
  ) {
    return await this.genreService.updateGenre(id, body.name, body.description);
  }

  
   //Delete genre (Admin only)

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteGenre(@Param('id') id: string) {
    return await this.genreService.deleteGenre(id);
  }
}