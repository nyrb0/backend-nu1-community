import {
    Body,
    Controller,
    Get,
    Patch,
    UseInterceptors,
    UploadedFile,
    HttpCode,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDtoUpdate } from './dto/userDto.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Auth()
    @Get(':username')
    async getProfile(@Param('username') username: string, @CurrentUser('username') username1: string) {
        return this.userService.getByUserName(username, username1);
    }

    @Auth()
    @Patch(':userId')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('avatar'))
    async updateUser(
        @Param('userId') userId: string,
        @Body() dto: UserDtoUpdate,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000000 }),
                    new FileTypeValidator({ fileType: 'image/' }),
                ],
                fileIsRequired: false,
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.userService.update(userId, dto, file);
    }
}
