import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/services/files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PostController],
  providers: [PostService, PrismaService, FilesService],
})
export class PostModule {}
