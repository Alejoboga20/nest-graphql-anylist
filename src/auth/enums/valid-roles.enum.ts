import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  USER = 'USER',
  SUPER_USER = 'SUPER_USER',
  ADMIN = 'ADMIN',
}

registerEnumType(ValidRoles, { name: 'ValidRoles' });
