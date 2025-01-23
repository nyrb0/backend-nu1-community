import { IsOptional, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  publicationId: string;

  @IsString()
  text: string;

  @IsOptional()
  userId: string;
}

export class DeleteCommentDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;
}
