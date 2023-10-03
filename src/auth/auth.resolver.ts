import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { RegisterInput, LoginInput } from './dto/input';
import { AuthResponseType } from './types/auth-response.type';

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

  @Query(() => String, { name: 'revalidateToken' })
  revalidateToken(): string {
    return 'This action returns a token';
  }
}
