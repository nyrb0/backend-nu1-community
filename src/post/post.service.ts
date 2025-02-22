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

    async getAllUserPosts(username: string) {
        const { id: userId } = await this.prisma.user.findUnique({
            where: { username },
        });

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
            isOwner: post.userId === userId,
            liked: Boolean(post.likes.length),
            saved: Boolean(post.saves.length),
        }));
    }

    async getAllPosts(userId: string, skip: number, take: number) {
        const posts = await this.prisma.publication.findMany({
            skip,
            take,
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
            isOwner: post.userId === userId,
            liked: Boolean(post.likes.length),
            saved: Boolean(post.saves.length),
        }));
    }

    async postCreate(dto: PostDto, username: string, file?: Express.Multer.File) {
        let postImage;
        if (file) {
            postImage = `${Date.now()}-${file.originalname}`;
            await this.filesService.upload(postImage, file.buffer);
        }
        const post = await this.prisma.publication.create({
            data: {
                ...dto,
                imageUrl: postImage,
                user: {
                    connect: { username },
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

        return { ...post, isOwner: post.user.username === username };
    }

    async postUpdate(dto: UpdatePublicationDto, publicationId, username) {
        if (!dto && Object.keys(dto).length === 0) {
            throw new BadRequestException('DTO is empty');
        }

        const existingPost = await this.prisma.publication.findUnique({
            where: { id: publicationId },
        });

        if (!existingPost) {
            throw new NotFoundException('Publication not found or not owner the post');
        }
        if (existingPost.userId !== username) {
            throw new ForbiddenException('You are not the owner of this publication');
        }
        const post = this.prisma.publication.update({
            where: {
                id: publicationId,
            },
            data: {
                ...dto,
            },
        });

        return post;
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
            liked: Boolean(post.likes.length),
            saved: Boolean(post.saves.length),
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
            liked: Boolean(post.likes.length),
            saved: Boolean(post.saves.length),
        }));
    }
}
