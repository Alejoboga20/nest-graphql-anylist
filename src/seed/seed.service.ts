import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private isProduction: boolean = true;

  constructor(private readonly configService: ConfigService) {
    this.isProduction =
      this.configService.get<string>('STATE') === 'production';
  }

  async seed(): Promise<boolean> {
    if (this.isProduction) {
      throw new UnauthorizedException(
        'You are not allowed to seed in production',
      );
    }
    /* Clean DB */

    return true;
  }

  private async cleanDB(): Promise<void> {
    /* Clean DB */
    return;
  }

  private createUsers(): Promise<void> {
    /* Create users */
    return;
  }

  private createItems(): Promise<void> {
    /* Create items */
    return;
  }
}
