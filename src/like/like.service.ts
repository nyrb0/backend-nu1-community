import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LikeService {
    constructor(private prisma: PrismaService) {}

    async updateLikeCount(publicationId: string) {
        const countLike = await this.prisma.like.count({
            where: { publicationId },
        });
        await this.prisma.publication.update({
            where: { id: publicationId },
            data: { countLike },
        });
        return { message: 'Like count updated', count: countLike };
    }

    async likePost(userId: string, publicationId: string) {
        try {
            await this.prisma.like.create({
                data: {
                    publicationId,
                    userId,
                },
            });

            return this.updateLikeCount(publicationId);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error('Like already exists or invalid data');
        }
    }

    async unLike(userId: string, publicationId: string) {
        await this.prisma.like.deleteMany({
            where: { userId, publicationId },
        });

        return this.updateLikeCount(publicationId);
    }

    async getPostLikeCount(publicationId: string) {
        return this.prisma.like.count({
            where: {
                publicationId,
            },
        });
    }

    async hasLikedUserPost(userId: string, publicationId: string) {
        const isLike = await this.prisma.like.findFirst({
            where: { userId, publicationId },
        });
        return !!isLike;
    }
}
