import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { AdminGuard } from './guard/admin.guard';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [GenreController],
  providers: [GenreService, AdminGuard],
  exports: [GenreService],
})
export class GenreModule {}