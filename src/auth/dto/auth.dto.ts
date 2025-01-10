import { IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  username: string;

  @MinLength(6, { message: 'Password must be length 6' })
  @IsString()
  password: string;
}
