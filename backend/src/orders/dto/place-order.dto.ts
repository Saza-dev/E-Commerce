import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  addressId: string; // Address.id to snapshot

  @IsOptional()
  @IsString()
  paymentRef?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}
