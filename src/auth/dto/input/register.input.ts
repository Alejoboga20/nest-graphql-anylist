import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(3)
  fullName: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;
}
