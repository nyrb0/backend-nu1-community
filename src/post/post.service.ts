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
    return await this.prisma.publication.findMany({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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
