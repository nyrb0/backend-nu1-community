import { Visibility } from '@prisma/client';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class PostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsInt()
  @IsOptional()
  views: number = 0;

  // @IsString({ each: true })
  // @IsArray()
  // @IsString()
  // imageUrl: string;

  @IsInt()
  @IsOptional()
  commentsCount: number = 0;

  @IsEnum(Visibility)
  @IsOptional()
  visibility: Visibility = Visibility.PUBLIC;
}

export class UpdatePublicationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  likes?: number;

  @IsOptional()
  @IsInt()
  views?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrl?: string[];

  @IsOptional()
  @IsInt()
  commentsCount?: number;

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
