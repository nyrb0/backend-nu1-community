import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostDto } from './dto/post.dto';
import { FilesService } from 'src/services/files.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async getAll(userId: string) {
    const posts = await this.prisma.publication.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            identification: true,
            name: true,
            lastName: true,
          },
        },
        likes: {
          where: { userId },
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      ...post,
      liked: post.likes.length > 0,
    }));
  }

  async postCreate(dto: PostDto, userId: string, file?: Express.Multer.File) {
    let postImage;
    if (file) {
      postImage = `${Date.now()}-${file.originalname}`;
      await this.filesService.upload(postImage, file.buffer);
    }
    return await this.prisma.publication.create({
      data: {
        ...dto,
        imageUrl: postImage,
        user: {
          connect: { id: userId },
        },
        mentions: {
          create: (dto.mentions ?? []).map((username) => ({
            user: { connect: { username } },
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            identification: true,
            name: true,
            lastName: true,
            avatarUrl: true,
            mentions: true,
          },
        },
      },
    });
  }
}
