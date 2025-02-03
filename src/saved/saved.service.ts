import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SavedService {
    constructor(private prisma: PrismaService) {}

    async updateSavedCount(publicationId: string) {
        const savedCount = await this.prisma.saved.count({
            where: { publicationId },
        });
        await this.prisma.publication.update({
            where: { id: publicationId },
            data: { savedCount },
        });
        return { message: 'Saved count updated', count: savedCount };
    }

    async savedPost(userId: string, publicationId: string) {
        try {
            await this.prisma.saved.create({
                data: {
                    publicationId,
                    userId,
                },
            });

            return this.updateSavedCount(publicationId);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error('Saved already exists or invalid data');
        }
    }

    async unSaved(userId: string, publicationId: string) {
        await this.prisma.saved.deleteMany({
            where: { userId, publicationId },
        });
        return this.updateSavedCount(publicationId);
    }

    async getPostSavedCount(publicationId: string) {
        return this.prisma.saved.count({
            where: {
                publicationId,
            },
        });
    }

    async hasSavedUserPost(userId: string, publicationId: string) {
        const isSaved = await this.prisma.saved.findFirst({
            where: { userId, publicationId },
        });
        return !!isSaved;
    }
}
