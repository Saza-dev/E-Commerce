import { IsInt } from 'class-validator';

export class RemoveFromCartDto {
  @IsInt()
  itemId: number;
}
