import { Injectable } from '@nestjs/common';
import { RegisterInput } from './dto/input/register.input';
import { AuthResponseType } from './types/auth-response.type';

@Injectable()
export class AuthService {
  async register(registerInput: RegisterInput): Promise<AuthResponseType> {
    throw new Error(`Not implemented yet ${JSON.stringify(registerInput)}`);
  }
}
