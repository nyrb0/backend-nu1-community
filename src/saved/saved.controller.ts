import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SavedService } from './saved.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('save')
export class SavedController {
    constructor(private readonly savedService: SavedService) {}

    @Auth()
    @Post('do/:postId')
    async likePost(@CurrentUser('id') userId: string, @Param('postId') publicationId: string) {
        return this.savedService.savedPost(userId, publicationId);
    }

    @Auth()
    @Delete('do/:postId')
    async unLike(@CurrentUser('id') userId: string, @Param('postId') publicationId: string) {
        return this.savedService.unSaved(userId, publicationId);
    }

    @Auth()
    @Get('count/:postId')
    async get(@Param('postId') publicationId: string) {
        return this.savedService.getPostSavedCount(publicationId);
    }

    @Auth()
    @Get('check/:publicationId')
    async getHasLikedUserPost(@CurrentUser('id') userId: string, @Param('publicationId') publicationId: string) {
        return this.savedService.hasSavedUserPost(userId, publicationId);
    }
}
