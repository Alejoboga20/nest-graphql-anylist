import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import { Item } from '../items/entities/item.entity';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {
  private isProduction: boolean = true;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly itemsService: ItemsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {
    this.isProduction =
      this.configService.get<string>('STATE') === 'production';
  }

  async seed(): Promise<boolean> {
    if (this.isProduction) {
      throw new UnauthorizedException(
        'You are not allowed to seed in production',
      );
    }
    try {
      /* Clean DB */
      await this.cleanDB();
      /* Insert users */
      const adminUser = await this.loadUsers();
      /* Insert items */
      await this.loadItems(adminUser);

      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }

  private async cleanDB(): Promise<void> {
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  private async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }

    return users[0];
  }

  private async loadItems(user: User): Promise<void> {
    const itemsPromises = [];

    for (const item of SEED_ITEMS) {
      itemsPromises.push(await this.itemsService.create(item, user));
    }
    await Promise.all(itemsPromises);
  }
}
