import { Logger, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dtos/args/roles.args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dtos/inputs/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  private logger: Logger = new Logger('UserResolver');

  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRolesArgs: ValidRolesArgs,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User[]> {
    this.logger.log(`User ${user.id} is trying to get all users`);

    return this.userService.findAll(validRolesArgs.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User> {
    this.logger.log(`User ${user.id} is trying to get user ${id}`);

    return this.userService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User> {
    return this.userService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  async blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User> {
    this.logger.log(`User ${user.id} is trying to block user ${id}`);

    return this.userService.block(id, user);
  }
}
