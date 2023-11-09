import { Logger, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dtos/args/roles.args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dtos/inputs/update-user.input';
import { ItemsService } from '../items/items.service';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  private logger: Logger = new Logger('UserResolver');

  constructor(
    private readonly userService: UserService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

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

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @Parent() user: User,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) adminUser: User,
  ): Promise<number> {
    this.logger.log(
      `User ${adminUser.id} is trying to get item count of user ${user.id}`,
    );
    return this.itemsService.itemsCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'userItems' })
  async getItemsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) adminUser: User,
  ): Promise<Item[]> {
    this.logger.log(
      `User ${adminUser.id} is trying to get item count of user ${user.id}`,
    );
    return this.itemsService.findAllByUser(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async listCount(
    @Parent() user: User,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) adminUser: User,
  ): Promise<number> {
    this.logger.log(
      `User ${adminUser.id} is trying to get item count of user ${user.id}`,
    );
    return this.listsService.listtCountByUser(user);
  }

  @ResolveField(() => [List], { name: 'userLists' })
  async getListsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) adminUser: User,
  ): Promise<List[]> {
    this.logger.log(
      `User ${adminUser.id} is trying to get item count of user ${user.id}`,
    );
    return this.listsService.findAllByUser(user, paginationArgs, searchArgs);
  }
}
