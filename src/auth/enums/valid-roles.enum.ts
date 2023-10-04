import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  USER = 'user',
  SUPER_USER = 'super_user',
  ADMIN = 'admin',
}

registerEnumType(ValidRoles, { name: 'ValidRoles' });
