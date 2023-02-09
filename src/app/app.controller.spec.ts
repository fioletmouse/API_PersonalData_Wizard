import { Test, TestingModule } from '@nestjs/testing';
import Companies from 'src/constants/CompaniesEnum';
import { WizardRouteDto } from './app-input.dto';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const appService = {
    getRoute: jest.fn(),
    createSession: jest.fn(),
    patchPage: jest.fn(),
    findPageData: jest.fn()
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appService
        }
      ]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    appService.getRoute.mockClear();
    appService.createSession.mockClear();
    appService.patchPage.mockClear();
    appService.findPageData.mockClear();
  });

  it('should return routes by company', async () => {
    const queryParams = { companyId: Companies.NewAge } as WizardRouteDto;
    const routerMock = {
      wizardSections: [],
      lastEdit: null
    };
    appService.getRoute.mockImplementation(() => Promise.resolve(routerMock));

    const route = await appController.getRoute(queryParams);
    expect(appService.getRoute.mock.calls.length).toBe(1);
    expect(appService.getRoute.mock.calls[0][0]).toBeUndefined();
    expect(appService.getRoute.mock.calls[0][1]).toBe(queryParams.companyId);
    expect(route).toBe(routerMock);
  });
});
