import { Controller, Delete, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':userId/:postId')
  async likePost(
    @Param('userId') userId: string,
    @Param('postId') publicationId: string,
  ) {
    return this.likeService.likePost(userId, publicationId);
  }

  @Delete(':userId/:postId')
  async unLike(
    @Param('userId') userId: string,
    @Param('postId') publicationId: string,
  ) {
    return this.likeService.unLike(userId, publicationId);
  }
}
