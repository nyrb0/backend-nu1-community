import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return await this.prisma.publication.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async postCreate(dto: PostDto, userId: string) {
    return await this.prisma.publication.create({
      data: {
        ...dto,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: true,
      },
    });
  }
}
