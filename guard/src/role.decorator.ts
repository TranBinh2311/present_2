import { SetMetadata } from '@nestjs/common';
export const RbacRoles = (...roles: string[]) => SetMetadata('roles', roles);
