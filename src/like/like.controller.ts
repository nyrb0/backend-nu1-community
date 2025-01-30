import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Auth()
  @Post('do/:postId')
  async likePost(@CurrentUser('id') userId: string, @Param('postId') publicationId: string) {
    return this.likeService.likePost(userId, publicationId);
  }

  @Auth()
  @Delete('do/:postId')
  async unLike(@CurrentUser('id') userId: string, @Param('postId') publicationId: string) {
    return this.likeService.unLike(userId, publicationId);
  }

  @Auth()
  @Get('count/:postId')
  async get(@Param('postId') publicationId: string) {
    return this.likeService.getPostLikeCount(publicationId);
  }

  @Auth()
  @Get('check/:publicationId')
  async getHasLikedUserPost(@CurrentUser('id') userId: string, @Param('publicationId') publicationId: string) {
    return this.likeService.hasLikedUserPost(userId, publicationId);
  }
}
