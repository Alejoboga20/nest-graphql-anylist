import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

import { ValidRoles } from '../../../auth/enums/valid-roles.enum';

@ArgsType()
export class ValidRolesArgs {
  @Field(() => [String], { nullable: true })
  @IsArray()
  roles: string[] = [];
}
