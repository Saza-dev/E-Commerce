import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Length,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  // Allow updating base User fields too (for convenience)
  @IsOptional() @IsString() @Length(1, 100) name?: string;
  @IsOptional() @IsString() @Length(7, 20) phone?: string;

  // Profile-only fields
  @IsOptional() @IsDateString() dateOfBirth?: string; // ISO date
  @IsOptional() @IsIn(['MALE', 'FEMALE', 'OTHER']) gender?:
    | 'MALE'
    | 'FEMALE'
    | 'OTHER';
  @IsOptional() @IsUrl() avatarUrl?: string;
  @IsOptional() @IsString() @Length(0, 1000) notes?: string;
}
