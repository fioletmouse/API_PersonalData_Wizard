import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WizardRouteDto } from './app-input.dto';
import { AppService } from './app.service';

@ApiTags('wizard')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('routing')
  async getRoute(@Query() queryParams: WizardRouteDto) {
    const route = this.appService.getRoute(queryParams.sessionId, queryParams.companyID);
    return route;
  }
}
