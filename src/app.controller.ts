import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string/*Promise<string>*/ {
    return 'asf'
    // return this.appService.getHello();
  }

  @Get()
  async fillData(): Promise<boolean> /*Promise<string>*/ {
    const a = await this.appService.fillData();
    return a;
  }
}
