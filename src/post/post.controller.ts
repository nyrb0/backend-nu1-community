import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpCode,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PostDto, UpdatePublicationDto } from './dto/post.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @HttpCode(200)
    @Post('')
    @Auth()
    @UseInterceptors(FileInterceptor('imageUrl'))
    createPost(
        @CurrentUser('username') username: string,
        @Body() dto: PostDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10000000 }),
                    new FileTypeValidator({ fileType: 'image/' }),
                ],
                fileIsRequired: false,
            }),
        )
        file?: Express.Multer.File,
    ) {
        return this.postService.postCreate(dto, username, file);
    }

    @Auth()
    @HttpCode(200)
    @Get('user/:username')
    async getAllUser(@Param('username') username: string) {
        return this.postService.getAllUserPosts(username);
    }
    @Auth()
    @HttpCode(200)
    @Get('getall')
    async getAll(
        @CurrentUser('id') userId: string,
        @Query('skip', ParseIntPipe) skip: number = 0,
        @Query('take', ParseIntPipe) take: number = 1,
    ) {
        take = Math.min(take, 50);
        return this.postService.getAllPosts(userId, skip, take);
    }

    @Auth()
    @HttpCode(200)
    @Get('likes/:userId')
    async getAllLikesPost(@Param('userId') userId: string) {
        return this.postService.getAllLikePosts(userId);
    }

    @Auth()
    @HttpCode(200)
    @Get('saves/:userId')
    async getAllSavesPost(@Param('userId') userId: string) {
        return this.postService.getAllLikePosts(userId);
    }

    @HttpCode(200)
    @Patch(':publicationId')
    @Auth()
    async updatePost(
        @Body() dto: UpdatePublicationDto,
        @Param('publicationId') publicationId: string,
        @CurrentUser('username') username: string,
    ) {
        if (!publicationId) throw new BadRequestException('publicationId is empty');
        return this.postService.postUpdate(dto, publicationId, username);
    }

    @Auth()
    @HttpCode(200)
    @Delete(':publicationId')
    async deletePost(@CurrentUser('id') userId: string, @Param('publicationId') publicationId: string) {
        if (!publicationId) throw new BadRequestException('publicationId is empty');
        return this.postService.deletePost(userId, publicationId);
    }
}
