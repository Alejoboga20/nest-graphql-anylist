import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ItemsModule],
  providers: [UserResolver, UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
