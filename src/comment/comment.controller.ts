import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CommentDto, DeleteCommentDto } from './dto/comment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpCode(200)
  @Auth()
  @Post()
  async addComment(@CurrentUser('id') userId: string, @Body() dto: CommentDto) {
    return this.commentService.addComment(userId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete()
  async deleteComment(@Body() dto: DeleteCommentDto) {
    return this.commentService.deleteComment(dto.userId, dto.id);
  }
}
