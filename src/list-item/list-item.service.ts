import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListItemInput } from './dto/create-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { UpdateListItemInput } from './dto/update-list-item.input';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    const listItem = await this.listItemRepository.save(newListItem);

    return listItem;
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { searchTerm = '' } = searchArgs;
    const { limit, offset } = paginationArgs;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (searchTerm) {
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${searchTerm.toLowerCase()}%`,
      });
    }

    const items = await queryBuilder.getMany();

    return items;
  }

  async countListItemsByList(list: List): Promise<number> {
    const totalItems = await this.listItemRepository.count({
      where: { list: { id: list.id } },
    });

    return totalItems;
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOne({ where: { id } });

    if (!listItem) throw new NotFoundException('List item not found');

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { itemId, listId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set({ ...rest })
      .where('id = :id', { id });

    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();
    const updatedListItem = await this.findOne(id);

    return updatedListItem;
  }
}
