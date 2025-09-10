import { IsISO8601, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @IsOptional()
  @IsISO8601()
  from?: string; // ISO date

  @IsOptional()
  @IsISO8601()
  to?: string; // ISO date
}

export class DaysDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  days?: number; // default in controller
}

export class LimitDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number; // default in controller
}
