import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async addComment(userId: string, { text, publicationId }: CommentDto) {
    if (text.length <= 0 || text.length >= 200)
      throw new NotAcceptableException('Length text is 0 and must not contain more than 200 length');

    return this.prisma.comments.create({
      data: {
        userId,
        publicationId,
        text,
      },
    });
  }

  async deleteComment(id: string, idComment: string) {
    const comment = await this.prisma.comments.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Not found comment');
    }

    if (comment.userId !== id) {
      throw new ForbiddenException('you do not have the right to delete this comment');
    }

    return this.prisma.comments.delete({
      where: {
        id: idComment,
      },
    });
  }

  async getCommentsPost(publicationId: string) {
    return this.prisma.comments.findMany({
      where: {
        publicationId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            lastName: true,
          },
        },
      },
    });
  }
}
