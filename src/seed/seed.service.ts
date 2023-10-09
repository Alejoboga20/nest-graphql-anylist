import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from '../items/entities/item.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SeedService {
  private isProduction: boolean = true;

  constructor(
    private readonly configService: ConfigService,
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
    /* Clean DB */
    await this.cleanDB();

    return true;
  }

  private async cleanDB(): Promise<void> {
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  private createItems(): Promise<void> {
    /* Create items */
    return;
  }

  private createUsers(): Promise<void> {
    /* Create users */
    return;
  }
}
