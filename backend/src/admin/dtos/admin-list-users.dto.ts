import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AdminListUsersDto {
  @IsOptional() @IsString() q?: string;

  @IsOptional() @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @IsInt() @Min(1) @Max(100) pageSize?: number = 20;

  @IsOptional() @IsIn(['createdAt', 'email', 'role', 'status']) sortBy?:
    | 'createdAt'
    | 'email'
    | 'role'
    | 'status' = 'createdAt';
  @IsOptional() @IsIn(['asc', 'desc']) sortDir?: 'asc' | 'desc' = 'desc';
}
