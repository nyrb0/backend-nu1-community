import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PostDto } from './dto/post.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpCode(200)
  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('imageUrl'))
  createPost(
    @CurrentUser('id') userId: string,
    @Body() dto: PostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10000000 }), new FileTypeValidator({ fileType: 'image/' })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.postService.postCreate(dto, userId, file);
  }

  @HttpCode(200)
  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.postService.getAll(userId);
  }
}
