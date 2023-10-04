import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dtos/args/roles.args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRolesArgs: ValidRolesArgs,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User[]> {
    console.log({ user });
    return this.userService.findAll(validRolesArgs.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User> {
    console.log({ user });
    return this.userService.findOneById(id);
  }

  @Mutation(() => User)
  async blockUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.block(id);
  }
}
