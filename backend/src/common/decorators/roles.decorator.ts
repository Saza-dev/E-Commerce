import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export type RoleLiteral = 'ADMIN' | 'CUSTOMER';
export const Roles = (...roles: RoleLiteral[]) => SetMetadata(ROLES_KEY, roles);
