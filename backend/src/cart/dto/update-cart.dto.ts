import { IsInt } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  itemId: number;
  @IsInt()
  quantity: number;
}
