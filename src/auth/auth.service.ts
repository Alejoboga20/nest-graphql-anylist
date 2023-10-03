import { Injectable } from '@nestjs/common';
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
    const { email } = loginInput;
    const user = await this.userService.findOneByEmail(email);

    return {
      user,
      token: 'token',
    };
  }
}
