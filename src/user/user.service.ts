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
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dtos/inputs/update-user.input';

const ROUNDS = 10;

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
      });

      return user;
    } catch (error) {
      this.handleDbErrors({
        code: 'error-001',
        detail: `User with id ${id} not found`,
      });
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email },
      });

      return user;
    } catch (error) {
      this.handleDbErrors({
        code: 'error-001',
        detail: `User with email ${email} not found`,
      });
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

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser: User,
  ): Promise<User> {
    try {
      const userToUpdate = await this.userRepository.preload({
        ...updateUserInput,
      });
      userToUpdate.lastUpdateBy = adminUser;

      await this.userRepository.save(userToUpdate);

      return { id, ...userToUpdate, lastUpdateBy: adminUser };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return this.userRepository.find();

    const users = await this.userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();

    return users;
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    await this.userRepository.save(userToBlock);

    return { ...userToBlock, isActive: false };
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('check logs');
  }
}
