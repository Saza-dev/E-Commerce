import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AdminCreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
}
