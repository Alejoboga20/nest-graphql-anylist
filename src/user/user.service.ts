import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async findAll(): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async findOne(id: string): Promise<User> {
    throw new Error(`Method not implemented. ${id}`);
  }

  async block(id: string): Promise<User> {
    throw new Error(`Method not implemented. ${id}`);
  }
}
