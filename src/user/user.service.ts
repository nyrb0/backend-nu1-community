import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDtoUpdate } from './dto/userDto.dto';
import { FilesService } from 'src/services/files.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private readonly filesService: FilesService,
    ) {}

    getById({ id }: { id: string }) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    getByUserName(username, username1) {
        let isOwner = false;
        if (username1 === username) isOwner = true;
        const data = this.prisma.user.findUnique({
            where: { username },
        });
        return { ...data, isOwner };
    }

    async isUsername(username: string) {
        return this.prisma.user.findUnique({ where: { username } });
    }
    async addRefreshTokenCookie() {
        return;
    }
    async create(dto: AuthDto) {
        const data = {
            ...dto,
            email: '',
            password: await hash(dto.password),
        };

        return this.prisma.user.create({
            data,
        });
    }

    async update(userId: string, dto: UserDtoUpdate, file?: Express.Multer.File) {
        const user = await this.getById({ id: userId });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        let passwordHash = user.password;
        if (dto?.password && user.password !== dto.password) {
            passwordHash = await hash(dto.password);
        }

        let avatarUrl = user.avatarUrl;
        if (file) {
            avatarUrl = `${Date.now()}-${file.originalname}`;
            await this.filesService.upload(avatarUrl, file.buffer);

            if (user.avatarUrl) {
                await this.filesService.delete(user.avatarUrl);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateUser } = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...dto,
                avatarUrl,
                password: passwordHash,
            },
        });

        return updateUser;
    }
}
