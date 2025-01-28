import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserDtoUpdate {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  identification?: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}
