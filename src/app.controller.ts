import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/rule/create')
  async ruleCreate() {
    const ruleId = this.appService.ruleCreate();
    return ruleId;
  }

  @Get('/rule/check')
  async ruleCheck(): Promise<string> {
    return this.appService.ruleCheck();
  }

  @Get('/rule/check-historical')
  async ruleCheckHistorical(): Promise<string> {
    return this.appService.ruleCheckHistorical();
  }
}
