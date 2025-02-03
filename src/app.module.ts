import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { SavedModule } from './saved/saved.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), UserModule, PostModule, LikeModule, CommentModule, SavedModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
