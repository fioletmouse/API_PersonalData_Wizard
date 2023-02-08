import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSessionDto, PatchPageDto, WizardRouteDto } from './app-input.dto';
import { AppService } from './app.service';

@ApiTags('wizard')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('routing')
  async getRoute(@Query() queryParams: WizardRouteDto) {
    const route = this.appService.getRoute(queryParams.sessionId, queryParams.companyId);
    return route;
  }

  @Post()
  async createSession(@Req() req, @Body() createSessionParams: CreateSessionDto) {
    const createdSessionId = await this.appService.createSession(createSessionParams);
    return createdSessionId;
  }

  @Patch()
  async patchPage(@Req() req, @Body() patchPage: PatchPageDto) {
    const patchedPage = await this.appService.patchPage(patchPage);
    return patchedPage;
  }
}
