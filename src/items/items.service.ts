import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { User } from '../user/entities/user.entity';

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

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item #${id} not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item #${id} not found`);

    await this.itemRepository.save(item);

    return item;
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);
    if (!item) throw new NotFoundException(`Item #${id} not found`);

    await this.itemRepository.remove(item);

    return { ...item, id };
  }
}
