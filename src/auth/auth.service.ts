import { Injectable } from '@nestjs/common';
import { RegisterInput } from './dto/input/register.input';
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
}
