import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { RegisterInput } from '../auth/dto/input/register.input';

const ROUNDS = 10;

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email },
      });

      return user;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async create(registerInput: RegisterInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...registerInput,
        password: bcrypt.hashSync(registerInput.password, ROUNDS),
      });
      await this.userRepository.save(newUser);

      return newUser;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll(): Promise<User> {
    throw new Error('Method not implemented.');
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
