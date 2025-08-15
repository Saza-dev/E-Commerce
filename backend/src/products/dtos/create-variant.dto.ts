import {
  IsString,
  IsNumber,
  IsInt,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { StockStatus } from 'src/common/enums/stock-status.enum';

export class CreateVariantDto {
  @IsString()
  size: string;

  @IsString()
  color: string;

  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;

  @IsEnum(StockStatus)
  @IsOptional()
  status?: StockStatus;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
