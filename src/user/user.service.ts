import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getById({ id }: { id: string }) {
    return this.prisma.user.findUnique({
      where: { id },
    });
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
}
