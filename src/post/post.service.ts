import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostDto, UpdatePublicationDto } from './dto/post.dto';
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
                        avatarUrl: true,
                    },
                },
                likes: {
                    where: { userId },
                    select: { id: true },
                },
                saves: {
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
            saved: post.saves.length > 0,
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

    async postUpdate(dto: UpdatePublicationDto, userId: string, publicationId) {
        if (!dto && Object.keys(dto).length === 0) {
            throw new BadRequestException('DTO is empty');
        }

        const existingPost = await this.prisma.publication.findUnique({
            where: { id: publicationId },
        });

        if (!existingPost) {
            throw new NotFoundException('Publication not found');
        }

        if (existingPost.userId !== userId) {
            throw new ForbiddenException('You are not the owner of this publication');
        }

        return this.prisma.publication.update({
            where: {
                id: publicationId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deletePost(userId: string, publicationId) {
        return this.prisma.publication.delete({
            where: {
                id: publicationId,
                userId,
            },
        });
    }

    async getAllLikePosts(userId) {
        const posts = await this.prisma.publication.findMany({
            where: {
                likes: {
                    some: {
                        userId,
                    },
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
                    },
                },
                likes: {
                    where: { userId },
                    select: { id: true },
                },
                saves: {
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
            saved: post.saves.length > 0,
        }));
    }

    async getAllSavesPosts(userId) {
        const posts = await this.prisma.publication.findMany({
            where: {
                saves: {
                    some: {
                        userId,
                    },
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
                    },
                },
                likes: {
                    where: { userId },
                    select: { id: true },
                },
                saves: {
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
            saved: post.saves.length > 0,
        }));
    }
}
