import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LoginInput, RegisterInput } from './dto/input';
import { AuthResponseType } from './types/auth-response.type';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerInput: RegisterInput): Promise<AuthResponseType> {
    const user = await this.userService.create(registerInput);

    return {
      user,
      token: 'token',
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponseType> {
    const { email, password } = loginInput;
    const user = await this.userService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      user,
      token: 'token',
    };
  }
}
