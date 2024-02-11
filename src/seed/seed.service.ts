import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import { Item } from '../items/entities/item.entity';
import { SEED_ITEMS, SEED_USERS, SEED_LISTS } from './data/seed-data';
import { ItemsService } from '../items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class SeedService {
  private isProduction: boolean = true;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService,

    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(List) private readonly listRepository: Repository<List>,
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
      /* Insert lists */
      const list = await this.loadLists(adminUser);
      /* Insert list items */
      const items = await this.itemsService.findAllByUser(
        adminUser,
        { limit: 5, offset: 0 },
        { searchTerm: '' },
      );
      await this.loadListItems(list, items);

      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }

  private async cleanDB(): Promise<void> {
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    await this.listRepository.createQueryBuilder().delete().where({}).execute();
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

  private async loadLists(user: User): Promise<List> {
    const lists = [];

    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }

    return lists[0];
  }

  private async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      await this.listItemService.create({
        itemId: item.id,
        listId: list.id,
        completed: Math.random() > 0.5 ? true : false,
        quantity: Math.round(Math.random() * 10),
      });
    }
  }
}
