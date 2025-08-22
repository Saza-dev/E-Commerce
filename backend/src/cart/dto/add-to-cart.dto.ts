import { IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  productId: number;

  @IsInt()
  variantId: number;

  @IsInt()
  @Min(1)
  quantity?: number = 1;
}
