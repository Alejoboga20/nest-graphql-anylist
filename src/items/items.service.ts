import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { User } from '../user/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemRepository.create({ ...createItemInput, user });
    await this.itemRepository.save(newItem);

    return newItem;
  }

  async findAll(): Promise<Item[]> {
    const items = await this.itemRepository.find();

    return items;
  }

  async findAllByUser(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    const { searchTerm } = searchArgs;
    const { limit, offset } = paginationArgs;

    const items = await this.itemRepository.find({
      where: { user: { id: user.id } },
      take: limit,
      skip: offset,
    });

    return items;
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!item) throw new NotFoundException(`Item #${id} not found`);

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);

    const item = await this.itemRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item #${id} not found`);

    await this.itemRepository.save(item);

    return item;
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    if (!item) throw new NotFoundException(`Item #${id} not found`);

    await this.itemRepository.remove(item);

    return { ...item, id };
  }

  async itemsCountByUser(user: User): Promise<number> {
    const itemsCount = await this.itemRepository.count({
      where: { user: { id: user.id } },
    });

    return itemsCount;
  }
}
