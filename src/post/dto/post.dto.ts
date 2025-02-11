import { Visibility } from '@prisma/client';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class PostDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

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

    @IsArray()
    @IsOptional()
    mentions?: string[];
}

export class UpdatePublicationDto {
    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    // @IsString({ each: true })
    // @IsArray()
    // @IsString()
    // imageUrl?: string;

    @IsEnum(Visibility)
    @IsOptional()
    visibility?: Visibility = Visibility.PUBLIC;
}
