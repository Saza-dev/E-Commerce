import { IsIn } from 'class-validator';
export class AdminUpdateRoleDto {
  @IsIn(['ADMIN', 'CUSTOMER']) role: 'ADMIN' | 'CUSTOMER';
}
