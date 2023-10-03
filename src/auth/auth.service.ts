import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginInput, RegisterInput } from './dto/input';
import { AuthResponseType } from './types/auth-response.type';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponseType> {
    const user = await this.userService.create(registerInput);
    const token = this.generateJwt(user.id);

    return {
      user,
      token,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponseType> {
    const { email, password } = loginInput;
    const user = await this.userService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.generateJwt(user.id);

    return {
      user,
      token,
    };
  }

  private generateJwt(id: string) {
    return this.jwtService.sign({ id });
  }
}
