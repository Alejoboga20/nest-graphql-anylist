import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { RegisterInput, LoginInput } from './dto/input';
import { AuthResponseType } from './types/auth-response.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponseType, { name: 'register' })
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<AuthResponseType> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponseType, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponseType> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponseType, { name: 'revalidateToken' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentUser() user: User): AuthResponseType {
    console.log({ user });
    throw new Error('Resolver not implemented');
  }
}
