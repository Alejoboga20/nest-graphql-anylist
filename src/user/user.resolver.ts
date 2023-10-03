import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'user' })
  async findAll(): Promise<User> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<string> {
    return `This action returns a #${id} user`;
  }

  @Mutation(() => User)
  async blockUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.block(id);
  }
}
