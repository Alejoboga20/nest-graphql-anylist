import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateListInput } from './dto/create-list.input';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { UpdateListInput } from './dto/update-list.input';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listRepository.create({ ...createListInput, user });
    await this.listRepository.save(newList);

    return newList;
  }

  async findAllByUser(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { searchTerm = '' } = searchArgs;
    const { limit, offset } = paginationArgs;

    const queryBuilder = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where({ user: { id: user.id } });

    if (searchTerm) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${searchTerm.toLowerCase()}%`,
      });
    }

    const items = await queryBuilder.getMany();

    return items;
  }

  async findOne(id: string, user: User): Promise<List> {
    const item = await this.listRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!item) throw new NotFoundException(`List #${id} not found`);

    return item;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);

    const updatedList = await this.listRepository.preload({
      ...updateListInput,
      user,
    });

    if (!updatedList) throw new NotFoundException(`List #${id} not found`);

    await this.listRepository.save(updatedList);

    return updatedList;
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    if (!list) throw new NotFoundException(`Item #${id} not found`);

    await this.listRepository.remove(list);

    return { ...list, id };
  }

  async listtCountByUser(user: User): Promise<number> {
    const listCount = await this.listRepository.count({
      where: { user: { id: user.id } },
    });

    return listCount;
  }
}
