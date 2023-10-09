import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UserModule } from '../user/user.module';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [ConfigModule, UserModule, ItemsModule],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
