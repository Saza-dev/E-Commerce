import { IsIn } from 'class-validator';
export class AdminUpdateStatusDto {
  @IsIn(['ACTIVE', 'SUSPENDED']) status: 'ACTIVE' | 'SUSPENDED';
}
