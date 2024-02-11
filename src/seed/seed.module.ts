import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UserModule } from '../user/user.module';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from 'src/lists/lists.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  imports: [ConfigModule, UserModule, ItemsModule, ListsModule, ListItemModule],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
