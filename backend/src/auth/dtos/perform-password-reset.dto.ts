import { IsString, MinLength } from 'class-validator';
export class PerformPasswordResetDto {
  @IsString() token: string; // raw token from email/link
  @IsString() @MinLength(8) newPassword: string;
}
