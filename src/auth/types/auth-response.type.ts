import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class AuthResponseType {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}
