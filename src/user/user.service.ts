import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { RegisterInput } from '../auth/dto/input/register.input';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(registerInput: RegisterInput): Promise<User> {
    try {
      const newUser = this.userRepository.create(registerInput);
      await this.userRepository.save(newUser);

      return newUser;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll(): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async findOne(id: string): Promise<User> {
    throw new Error(`Method not implemented. ${id}`);
  }

  async block(id: string): Promise<User> {
    throw new Error(`Method not implemented. ${id}`);
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('check logs');
  }
}
