import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor() {}

  async seed(): Promise<boolean> {
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
