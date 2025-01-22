import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PostDto } from './dto/post.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @HttpCode(200)
  @Post()
  @Auth()
  createPost(@CurrentUser('id') userId, @Body() dto: PostDto) {
    return this.postService.postCreate(dto, userId);
  }

  @HttpCode(200)
  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.postService.getAll(userId);
  }
}
