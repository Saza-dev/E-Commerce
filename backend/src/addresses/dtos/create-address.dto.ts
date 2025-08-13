import { IsBoolean, IsIn, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsIn(['SHIPPING', 'BILLING']) type: 'SHIPPING' | 'BILLING';

  @IsString() @Length(3, 200) line1: string;
  @IsOptional() @IsString() @Length(0, 200) line2?: string;

  @IsString() @Length(2, 100) city: string;
  @IsOptional() @IsString() @Length(0, 100) state?: string;

  @IsOptional() @IsString() @Length(0, 20) postalCode?: string;

  @IsString() @Length(2, 3) country: string; // "LK", "IN", "USA"
  @IsOptional() @IsString() @Length(6, 20) phone?: string;

  @IsOptional() @IsBoolean() isDefault?: boolean;
}
