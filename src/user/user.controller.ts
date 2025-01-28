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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDtoUpdate } from './dto/userDto.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get()
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById({ id });
  }

  @Auth()
  @Patch()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @CurrentUser('id') userId: string,
    @Body() dto: UserDtoUpdate,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 }), new FileTypeValidator({ fileType: 'image/' })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.update(userId, dto, file);
  }
}
